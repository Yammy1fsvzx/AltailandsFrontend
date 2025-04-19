'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
// Import the API function
import { submitApplication, ApplicationRequestBody } from '@/lib/api/requests'; 

interface ApplicationFormProps {
  listingId: number;
  listingTitle: string;
  // Add props for related object info
  modelName: string; // e.g., 'landplot', 'property'
  appLabel: string;  // e.g., 'listings'
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const ApplicationForm: React.FC<ApplicationFormProps> = ({ listingId, listingTitle, modelName, appLabel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    if (!name || !phone) { // Email is optional in API, phone is required
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните обязательные поля (Имя, Телефон).');
        return;
    }

    // Prepare data for API
    const requestData: ApplicationRequestBody = {
      name,
      phone,
      email: email || null,
      user_message: message || "",
      request_type: 'listing',
      status: 'new',
      related_object_content_type_app_label: appLabel,
      related_object_model_name: modelName,
      related_object_id: listingId,
    };

    console.log('Submitting application with data:', requestData);

    try {
      // Call the actual API function
      await submitApplication(requestData); 
      
      setStatus('success');
      setStatusMessage('Ваша заявка успешно отправлена!');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

    } catch (error) {
      console.error("Application submission error:", error);
      setStatus('error');
      // Provide a more helpful error message if possible
      setStatusMessage('Произошла ошибка при отправке. Пожалуйста, проверьте введенные данные или попробуйте позже.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Оставить заявку на объект</CardTitle>
        <p className="text-sm text-muted-foreground">{listingTitle}</p> {/* Show title */} 
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Имя *</Label>
            <Input 
              id="name" 
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Телефон *</Label>
            <Input 
              id="phone" 
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="ivan@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea 
              id="message" 
              placeholder="Ваш вопрос или комментарий..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {/* Disable button on success too */} 
          <Button type="submit" className="w-full mb-3" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'success' ? 'Отправлено!' : 'Отправить заявку'}
          </Button>
          {/* Status messages */} 
          {status === 'success' && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="mr-1 h-4 w-4"/> {statusMessage}
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApplicationForm; 