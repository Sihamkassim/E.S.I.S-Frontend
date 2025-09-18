import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar, WebinarQuestion } from '../../store/useWebinarstore';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface EditWebinarModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditWebinarModal: React.FC<EditWebinarModalProps> = ({ webinar, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { publishWebinar, unpublishWebinar, updateWebinar } = useWebinarStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [questions, setQuestions] = useState<Partial<WebinarQuestion>[]>([]);

  const [formData, setFormData] = useState({
    title: webinar?.title || '',
    description: webinar?.description || '',
    speaker: webinar?.speaker || '',
    schedule: webinar?.schedule ? new Date(webinar.schedule).toISOString().substring(0, 16) : '',
    duration: webinar?.duration || 60,
    capacity: webinar?.capacity || 50,
    price: webinar?.price || 0,
    location: webinar?.location || '',
    faq: webinar?.faq || '',
    refundPolicy: webinar?.refundPolicy || '',
  });

  React.useEffect(() => {
    if (webinar) {
      setFormData({
        title: webinar.title,
        description: webinar.description || '',
        speaker: webinar.speaker || '',
        schedule: webinar.schedule ? new Date(webinar.schedule).toISOString().substring(0, 16) : '',
        duration: webinar.duration || 60,
        capacity: webinar.capacity || 50,
        price: webinar.price || 0,
        location: webinar.location || '',
        faq: webinar.faq || '',
        refundPolicy: webinar.refundPolicy || '',
      });
      setQuestions(webinar.questions || []);
    }
  }, [webinar]);


  if (!webinar) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinar) return;

    const webinarData = new FormData();
    
    // Append all standard form data
    Object.entries(formData).forEach(([key, value]) => {
      webinarData.append(key, value.toString());
    });

    // Append questions as a JSON string
    webinarData.append('questions', JSON.stringify(questions));

    // Note: File/image updates would need separate handling if required
    
    toast.promise(updateWebinar(webinar.id.toString(), webinarData), {
      loading: 'Saving changes...',
      success: () => {
        onClose();
        return 'Webinar updated successfully!';
      },
      error: (err) => `Failed to update webinar: ${err.message}`,
    });
  };

  const handlePublishToggle = async () => {
    if (!webinar) return;

    setIsPublishing(true);
    const action = webinar.isPublished ? unpublishWebinar : publishWebinar;
    const actionName = webinar.isPublished ? 'unpublish' : 'publish';

    try {
      await action(webinar.id.toString());
      toast.success(`Webinar successfully ${actionName}ed!`);
      onClose(); // Close modal on success
    } catch (err) {
      toast.error(`Failed to ${actionName} webinar: ${(err as Error).message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Edit Webinar</DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Make changes to "{webinar.title}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            
            <div className="space-y-2">
              <label htmlFor="title" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Speaker */}
            <div className="space-y-2">
              <label htmlFor="speaker" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Speaker</label>
              <Input id="speaker" name="speaker" value={formData.speaker} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} rows={4} />
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <label htmlFor="schedule" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Schedule</label>
              <Input id="schedule" name="schedule" type="datetime-local" value={formData.schedule} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Duration (minutes)</label>
              <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label htmlFor="capacity" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Capacity</label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* Price */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="price" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Price ($)</label>
              <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} />
            </div>

            {/* FAQ */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="faq" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>FAQ</label>
              <Textarea id="faq" name="faq" value={formData.faq} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} rows={3} />
            </div>

            {/* Refund Policy */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="refundPolicy" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Refund Policy</label>
              <Textarea id="refundPolicy" name="refundPolicy" value={formData.refundPolicy} onChange={handleChange} className={`w-full ${theme === 'dark' ? 'text-white' : ''}`} rows={3} />
            </div>

          </div>

          <div className="space-y-4 md:col-span-2 border-t pt-6 mt-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Application Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center">
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>Question {qIndex + 1}</p>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="sm:col-span-3">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Question Text</label>
                    <Input
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      placeholder="e.g., What is your experience level?"
                      className={theme === 'dark' ? 'text-white' : ''}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Question Type</label>
                    <Select
                      value={q.type}
                      onValueChange={(value) => handleQuestionChange(qIndex, 'type', value)}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'text-white' : ''}>
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
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Options</label>
                    {q.options?.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => handleQuestionOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className={theme === 'dark' ? 'text-white' : ''}
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

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save changes</Button>
            
            {/* Publish/Unpublish Button */}
            <Button
              type="button"
              variant={webinar.isPublished ? "destructive" : "default"}
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className="min-w-[120px]"
            >
              {isPublishing 
                ? 'Processing...' 
                : webinar.isPublished ? 'Unpublish' : 'Publish'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWebinarModal;
