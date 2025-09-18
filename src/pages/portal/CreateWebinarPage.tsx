import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, WebinarQuestion } from '../../store/useWebinarstore';

const CreateWebinarPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { createWebinar, loading } = useWebinarStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    schedule: '',
    duration: '60',
    capacity: '50',
    price: '0',
    location: 'Online',
    faq: '',
    refundPolicy: '',
    image: null as File | null,
  });
  
  const [questions, setQuestions] = useState<Partial<WebinarQuestion>[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof WebinarQuestion, value: string | string[]) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };
  
  const handleQuestionOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[qIndex];
    if (currentQuestion && currentQuestion.options) {
      currentQuestion.options[oIndex] = value;
      setQuestions(newQuestions);
    }
  };

  const addQuestionOption = (qIndex: number) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[qIndex];
    if (currentQuestion) {
      if (!currentQuestion.options) currentQuestion.options = [];
      currentQuestion.options.push('');
      setQuestions(newQuestions);
    }
  };

  const removeQuestionOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[qIndex];
    if (currentQuestion && currentQuestion.options) {
      currentQuestion.options.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const webinarData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        webinarData.append(key, value);
      }
    });
    // Append questions as a JSON string
    webinarData.append('questions', JSON.stringify(questions));

    toast.promise(createWebinar(webinarData), {
      loading: 'Creating webinar...',
      success: () => {
        navigate('/dashboard/admin-webinars');
        return 'Webinar created successfully!';
      },
      error: (err) => `Failed to create webinar: ${err.message}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Webinars
        </Button>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Create New Webinar
        </h1>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Fill out the details below to schedule a new tech session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">Title</label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          {/* Speaker */}
          <div className="space-y-2">
            <label htmlFor="speaker" className="font-medium">Speaker</label>
            <Input id="speaker" name="speaker" value={formData.speaker} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="description" className="font-medium">Description</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} required />
          </div>

          {/* FAQ */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="faq" className="font-medium">FAQ</label>
            <Textarea id="faq" name="faq" value={formData.faq} onChange={handleChange} rows={3} />
          </div>

          {/* Refund Policy */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="refundPolicy" className="font-medium">Refund Policy</label>
            <Textarea id="refundPolicy" name="refundPolicy" value={formData.refundPolicy} onChange={handleChange} rows={3} />
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label htmlFor="schedule" className="font-medium">Schedule</label>
            <Input id="schedule" name="schedule" type="datetime-local" value={formData.schedule} onChange={handleChange} required />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="font-medium">Location</label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="duration" className="font-medium">Duration (minutes)</label>
            <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label htmlFor="capacity" className="font-medium">Capacity</label>
            <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="price" className="font-medium">Price ($)</label>
            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
          </div>

          {/* Image */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="image" className="font-medium">Cover Image</label>
            <Input id="image" name="image" type="file" onChange={handleFileChange} accept="image/*" />
          </div>
        </div>

        {/* Dynamic Questions */}
        <div className="space-y-4 md:col-span-2 border-t pt-6">
          <h3 className="text-lg font-medium">Application Questions</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Question {qIndex + 1}</p>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3">
                  <label className="text-sm font-medium">Question Text</label>
                  <Input
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                    placeholder="e.g., What is your experience level?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Question Type</label>
                  <Select
                    value={q.type}
                    onValueChange={(value) => handleQuestionChange(qIndex, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="checkbox">Checkboxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {['multiple-choice', 'checkbox'].includes(q.type || '') && (
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium">Options</label>
                  {q.options?.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => handleQuestionOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestionOption(qIndex, oIndex)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestionOption(qIndex)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addQuestion}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Application Question
          </Button>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/admin-webinars')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Webinar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateWebinarPage;
