import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from './icons';

interface DocumentationUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const DocumentationUploader: React.FC<DocumentationUploaderProps> = ({ onUpload, isProcessing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(currentFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      // Reset after upload
      setFile(null);
      setPreview(null);
    }
  };
  
  const handleRemoveImage = () => {
      setFile(null);
      setPreview(null);
  }

  return (
    <div className="bg-stone-50 p-4 rounded-lg shadow-sm border border-stone-200">
      <h3 className="text-xl font-semibold mb-3 text-stone-800">Загрузить Документ</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-amber-400 bg-amber-50/50' : 'border-stone-300 hover:border-amber-500'}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative">
                <img src={preview} alt="Предпросмотр" className="max-h-40 mx-auto rounded-md"/>
                <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm">&times;</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-stone-500">
                <UploadIcon className="w-8 h-8"/>
                <p>Перетащите изображение сюда или нажмите для выбора</p>
                <p className="text-xs">PNG, JPG, JPEG</p>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={!file || isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-50 focus:ring-amber-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Анализ...' : 'Загрузить и обработать'}
        </button>
      </form>
    </div>
  );
};

export default DocumentationUploader;