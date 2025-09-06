'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/lib/types';

interface BookFormProps {
  initialData?: Partial<Book>;
  isEditing?: boolean;
  onSuccess?: (book: Book) => void;
}

export default function BookForm({ initialData, isEditing = false, onSuccess }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price?.toString() || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    coverType: initialData?.coverType || '',
    stock: initialData?.stock?.toString() || '',
    reorderPoint: initialData?.reorderPoint?.toString() || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Fantasy', 'History', 'Biography', 'Other'];
  const coverTypes = ['Paperback', 'Hardcover'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.coverType) newErrors.coverType = 'Cover type is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.reorderPoint || parseInt(formData.reorderPoint) < 0) newErrors.reorderPoint = 'Valid reorder point is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    
    try {
      const url = isEditing ? `/api/books/${initialData?.id}` : '/api/books';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          coverType: formData.coverType,
          stock: parseInt(formData.stock),
          reorderPoint: parseInt(formData.reorderPoint)
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: isEditing ? 'Book Updated!' : 'Book Published!',
          description: isEditing ? 'Your book has been updated successfully.' : 'Your book has been published successfully.'
        });
        if (onSuccess) onSuccess(data.book);
      } else {
        setErrors({ general: data.error || `Failed to ${isEditing ? 'update' : 'publish'} book` });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span>{isEditing ? 'Edit Book' : 'Publish New Book'}</span>
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Update your book details' : 'Fill in details to publish your book'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''} placeholder="Enter book title" disabled={loading} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input id="price" type="number" step="0.01" min="0" value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)} className={errors.price ? 'border-red-500' : ''}
                    placeholder="0.00" disabled={loading} />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} disabled={loading}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="coverType">Cover Type *</Label>
                <Select value={formData.coverType} onValueChange={(value) => handleInputChange('coverType', value)} disabled={loading}>
                  <SelectTrigger className={errors.coverType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select cover type" />
                  </SelectTrigger>
                  <SelectContent>
                    {coverTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.coverType && <p className="text-sm text-red-500 mt-1">{errors.coverType}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input id="stock" type="number" min="0" value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)} className={errors.stock ? 'border-red-500' : ''}
                    placeholder="Copies" disabled={loading} />
                  {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <Label htmlFor="reorderPoint">Reorder Point *</Label>
                  <Input id="reorderPoint" type="number" min="0" value={formData.reorderPoint}
                    onChange={(e) => handleInputChange('reorderPoint', e.target.value)} className={errors.reorderPoint ? 'border-red-500' : ''}
                    placeholder="Min level" disabled={loading} />
                  {errors.reorderPoint && <p className="text-sm text-red-500 mt-1">{errors.reorderPoint}</p>}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`min-h-[200px] ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your book..." disabled={loading} />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditing ? 'Updating...' : 'Publishing...'}</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />{isEditing ? 'Update Book' : 'Publish Book'}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}