'use client';

import { useState, useRef, type DragEvent } from 'react';
import { UploadCloud, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transcribeAndExtract } from '@/lib/actions';
import { Progress } from '@/components/ui/progress';

type FileUploaderProps = {
  onProcessingStart: () => void;
  onProcessingSuccess: (data: { extractedText: string; language: 'id' | 'ar' | 'en' }, filename: string) => void;
  onProcessingError: (error: string) => void;
  onProcessingComplete: () => void;
  disabled: boolean;
  isProcessed: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function fileToDataURI(file: File, onProgress: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    reader.onload = () => {
      onProgress(100);
      resolve(reader.result as string);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export function FileUploader({
  onProcessingStart,
  onProcessingSuccess,
  onProcessingError,
  onProcessingComplete,
  disabled,
  isProcessed,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (disabled || isProcessing) return;

    if (file.size > MAX_FILE_SIZE) {
      const errorMessage = 'Ukuran berkas tidak boleh melebihi 5MB.';
      setError(errorMessage);
      onProcessingError(errorMessage);
      return;
    }

    onProcessingStart();
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setUploadProgress(0);

    try {
      const dataUri = await fileToDataURI(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadProgress(null); 

      const result = await transcribeAndExtract(dataUri, file.name);

      if (result.success && result.data) {
        onProcessingSuccess(result.data, file.name);
      } else {
        const errorMessage = result.error || 'Terjadi kesalahan yang tidak diketahui.';
        setError(errorMessage);
        onProcessingError(errorMessage);
      }
    } catch (e: any) {
        const errorMessage = e.message || 'Gagal membaca file.';
        setError(errorMessage);
        onProcessingError(errorMessage);
    } finally {
        setIsProcessing(false);
        onProcessingComplete();
        setUploadProgress(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
         <div className="flex flex-col items-center text-center w-full">
          {uploadProgress !== null ? (
            <>
              <p className="font-semibold">Mengunggah Berkas...</p>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">{fileName}</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mt-4" />
              <p className="text-sm font-semibold mt-2">{uploadProgress}%</p>
            </>
          ) : (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Mengekstrak Teks dari Berkas</p>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">{fileName}</p>
              <p className="text-sm text-muted-foreground mt-2">Sedang diproses, silahkan seruput kopi anda...</p>
            </>
          )}
        </div>
      )
    }

    if (isProcessed) {
      return (
         <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="mt-4 font-semibold">
            Berkas Berhasil Diproses
          </p>
          <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">{fileName}</p>
           <p className="text-sm text-muted-foreground mt-2">
            Silakan pilih bahasa output dan buat ringkasan.
          </p>
        </div>
      )
    }

    return (
       <div className="flex flex-col items-center text-center">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold">
            Seret & lepas berkas di sini atau klik untuk mengunggah
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Format yang didukung: .mp3, .wav, .m4a, .pdf, .docx (Maks. 5MB)
          </p>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </div>
    )

  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors min-h-[250px]',
        { 'bg-accent/50 border-primary': isDragging && !disabled },
        { 'hover:bg-accent/20 cursor-pointer': !disabled },
        { 'cursor-not-allowed opacity-50': disabled }
      )}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".mp3,.wav,.m4a,.pdf,.docx"
        disabled={disabled}
      />
      {renderContent()}
    </div>
  );
}
