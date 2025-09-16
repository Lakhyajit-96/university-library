"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Upload, FileText, Camera, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
}

const StudentVerificationPage = () => {
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: "university_card",
      title: "University ID Card",
      description: "Upload a clear photo of your official university ID card",
      icon: <GraduationCap className="w-6 h-6" />,
      completed: false,
      required: true,
    },
    {
      id: "student_email",
      title: "University Email Verification",
      description: "Verify your university email address (.edu domain)",
      icon: <FileText className="w-6 h-6" />,
      completed: false,
      required: true,
    },
    {
      id: "academic_transcript",
      title: "Academic Transcript",
      description: "Upload your latest academic transcript or enrollment proof",
      icon: <FileText className="w-6 h-6" />,
      completed: false,
      required: true,
    },
    {
      id: "photo_verification",
      title: "Photo Verification",
      description: "Take a selfie holding your university ID card",
      icon: <Camera className="w-6 h-6" />,
      completed: false,
      required: true,
    },
    {
      id: "reference_letter",
      title: "Faculty Reference",
      description: "Get a reference letter from a faculty member (optional)",
      icon: <FileText className="w-6 h-6" />,
      completed: false,
      required: false,
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    toast({
      title: "Step Completed",
      description: "Great! You've completed this verification step.",
    });
  };

  const handleSubmitVerification = async () => {
    const requiredSteps = steps.filter(step => step.required);
    const completedRequiredSteps = requiredSteps.filter(step => step.completed);
    
    if (completedRequiredSteps.length < requiredSteps.length) {
      toast({
        title: "Incomplete Verification",
        description: "Please complete all required verification steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted for review. You'll be notified within 2-3 business days.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const requiredSteps = steps.filter(step => step.required).length;
  const completedRequiredSteps = steps.filter(step => step.required && step.completed).length;

  return (
    <div className="min-h-screen bg-dark-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Student Verification</h1>
          <p className="text-light-100 text-lg">
            Complete the verification process to unlock premium features and benefits
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-dark-200 border-dark-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Verification Progress
            </CardTitle>
            <CardDescription className="text-light-100">
              Complete all required steps to become a verified student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {completedSteps} of {steps.length} completed
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {completedRequiredSteps} of {requiredSteps} required
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {Math.round((completedRequiredSteps / requiredSteps) * 100)}% Complete
                </div>
                <div className="text-light-100 text-sm">Required Steps</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-dark-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedRequiredSteps / requiredSteps) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Steps */}
        <div className="grid gap-4 mb-8">
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`bg-dark-200 border-dark-300 transition-all ${
                step.completed ? 'border-green-500' : 'hover:border-primary'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      step.completed ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{step.title}</h3>
                        {step.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {!step.required && (
                          <Badge variant="outline" className="text-xs">Optional</Badge>
                        )}
                      </div>
                      <p className="text-light-100 text-sm">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.completed)}
                    {!step.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStepComplete(step.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="mb-8 bg-dark-200 border-dark-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Verified Student Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Extended borrowing period (14 days vs 7 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Priority access to new books</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Exclusive study materials and resources</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Reduced late fees (50% discount)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Access to premium study groups</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Verified student badge on profile</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleSubmitVerification}
            disabled={completedRequiredSteps < requiredSteps || isSubmitting}
            className="bg-primary hover:bg-primary/90 px-8"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Verification Request
              </>
            )}
          </Button>
          
          {completedRequiredSteps < requiredSteps && (
            <p className="text-light-100 text-sm mt-2">
              Complete all required steps to submit your verification request
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentVerificationPage;
