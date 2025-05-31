import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ItineraryInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ItineraryInput({ value, onChange }: ItineraryInputProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-itinerary', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onChange(data.text);
      setUploadedFile(data.filename);
      toast({
        title: "File Uploaded Successfully",
        description: `Extracted text from ${data.filename}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Share Your Travel Plans</h3>
        <p className="text-lg text-gray-600">Upload your email confirmation or enter your itinerary details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* File Upload Area */}
        <Card 
          className="bg-light-gray rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-coral transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="text-center">
            {uploadedFile ? (
              <>
                <CheckCircle className="text-4xl text-green-500 mb-4 mx-auto" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Itinerary Uploaded</h4>
                <p className="text-gray-600 mb-4">{uploadedFile}</p>
                <label htmlFor="file-upload">
                  <Button variant="secondary" disabled={uploadMutation.isPending}>
                    Change File
                  </Button>
                </label>
              </>
            ) : (
              <>
                <CloudUpload className="text-4xl text-gray-400 mb-4 mx-auto" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Email Itinerary</h4>
                <p className="text-gray-600 mb-4">Drag & drop your email confirmation or click to browse</p>
                <label htmlFor="file-upload">
                  <Button className="bg-coral text-white hover:bg-red-600" disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? 'Uploading...' : 'Choose File'}
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">Supports: PDF, PNG, JPG, TXT</p>
              </>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
            />
          </div>
        </Card>

        {/* Text Input Area */}
        <Card className="bg-white border border-gray-200 rounded-2xl p-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Or Enter Manually</h4>
          <Textarea 
            className="w-full h-40 resize-none"
            placeholder={`Paste your travel itinerary here...

Example:
Flight: LAX to Tokyo, Dec 15-22
Hotel: Park Hyatt Tokyo
Free time: Dec 16-18 afternoons`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <Button 
            className="mt-4 bg-teal text-white hover:bg-green-700 w-full"
            onClick={() => {
              if (value.trim()) {
                toast({
                  title: "Itinerary Processed",
                  description: "Your itinerary text has been processed successfully",
                });
              }
            }}
          >
            Process Itinerary
          </Button>
        </Card>
      </div>
    </section>
  );
}
