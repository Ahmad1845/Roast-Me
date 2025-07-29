import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Flame, Zap, Target } from 'lucide-react';

const RoastForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    appearance: '',
    hobbies: '',
    personality: '',
    occupation: '',
    embarrassing_fact: '',
    roast_intensity: 'medium'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.name.trim() && formData.age.trim();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gray-900/50 border-red-500/20 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-red-400 flex items-center justify-center gap-2">
            <Target className="w-8 h-8" />
            Prepare for Annihilation
            <Target className="w-8 h-8" />
          </CardTitle>
          <p className="text-gray-300 mt-2">The more details you provide, the more savage the roast! 😈</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200 font-semibold">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="What should we call you while destroying you?"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-200 font-semibold">
                  Age <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="How long have you been disappointing people?"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
                />
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-gray-200 font-semibold">
                Occupation
              </Label>
              <Input
                id="occupation"
                placeholder="What do you pretend to be good at for money?"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
              />
            </div>

            {/* Appearance */}
            <div className="space-y-2">
              <Label htmlFor="appearance" className="text-gray-200 font-semibold">
                Physical Appearance
              </Label>
              <Textarea
                id="appearance"
                placeholder="Describe your look... we promise we'll be gentle 😏"
                value={formData.appearance}
                onChange={(e) => handleInputChange('appearance', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20 min-h-[80px]"
              />
            </div>

            {/* Hobbies */}
            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-gray-200 font-semibold">
                Hobbies & Interests
              </Label>
              <Textarea
                id="hobbies"
                placeholder="What boring activities do you think make you interesting?"
                value={formData.hobbies}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20 min-h-[80px]"
              />
            </div>

            {/* Personality */}
            <div className="space-y-2">
              <Label htmlFor="personality" className="text-gray-200 font-semibold">
                Personality Traits
              </Label>
              <Textarea
                id="personality"
                placeholder="How would your friends describe you? (If you have any...)"
                value={formData.personality}
                onChange={(e) => handleInputChange('personality', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20 min-h-[80px]"
              />
            </div>

            {/* Embarrassing Fact */}
            <div className="space-y-2">
              <Label htmlFor="embarrassing_fact" className="text-gray-200 font-semibold">
                Most Embarrassing Thing About You
              </Label>
              <Textarea
                id="embarrassing_fact"
                placeholder="Give us some ammunition... what's your biggest cringe moment?"
                value={formData.embarrassing_fact}
                onChange={(e) => handleInputChange('embarrassing_fact', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20 min-h-[80px]"
              />
            </div>

            {/* Roast Intensity */}
            <div className="space-y-2">
              <Label className="text-gray-200 font-semibold">Roast Intensity Level</Label>
              <Select value={formData.roast_intensity} onValueChange={(value) => handleInputChange('roast_intensity', value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-red-400 focus:ring-red-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="light" className="text-green-400">
                    🌱 Light Roast (Gentle burns)
                  </SelectItem>
                  <SelectItem value="medium" className="text-orange-400">
                    🔥 Medium Roast (Standard destruction)
                  </SelectItem>
                  <SelectItem value="savage" className="text-red-400">
                    💀 Savage Mode (Complete obliteration)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Preparing Your Destruction...
                </div>
              ) : (
                <>
                  <Flame className="w-5 h-5 mr-2" />
                  ROAST ME NOW!
                  <Zap className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoastForm;