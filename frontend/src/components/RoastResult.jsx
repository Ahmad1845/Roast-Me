import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RefreshCw, Volume2, VolumeX, Share2, Copy, Skull } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const RoastResult = ({ roast, isLoading, onNewRoast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (roast && !isLoading) {
      // Animate roast lines appearing one by one
      const lines = roast.roast.split('\n').filter(line => line.trim());
      setVisibleLines(0);
      
      const timer = setInterval(() => {
        setVisibleLines(prev => {
          if (prev < lines.length) {
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(timer);
    }
  }, [roast, isLoading]);

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(roast.roast);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      }
    } else {
      toast({
        title: "Text-to-Speech not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
  };

  const handleCopyRoast = async () => {
    try {
      await navigator.clipboard.writeText(roast.roast);
      toast({
        title: "Roast copied!",
        description: "The roast has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Couldn't copy the roast to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Roast Me - I got roasted!',
          text: roast.roast,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyRoast();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900/50 border-red-500/20 backdrop-blur-sm shadow-2xl">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <Skull className="w-8 h-8 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">🔥 Preparing Your Destruction 🔥</h3>
              <p className="text-gray-300 mb-4">Our AI is carefully crafting the perfect roast just for you...</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!roast) return null;

  const roastLines = roast.roast.split('\n').filter(line => line.trim());
  const intensityColors = {
    light: 'bg-green-500/20 text-green-400',
    medium: 'bg-orange-500/20 text-orange-400',
    savage: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Card */}
      <Card className="bg-gray-900/50 border-red-500/20 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center border-b border-gray-800">
          <CardTitle className="text-3xl text-red-400 flex items-center justify-center gap-2">
            <Skull className="w-8 h-8" />
            ROAST COMPLETE
            <Skull className="w-8 h-8" />
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="text-lg py-1 px-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-300 border-orange-500/30">
              Victim: {roast.userData.name}
            </Badge>
            <Badge className={`text-sm py-1 px-3 ${intensityColors[roast.userData.roast_intensity]} border-current`}>
              {roast.userData.roast_intensity.toUpperCase()} ROAST
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="py-8">
          <div className="space-y-4 mb-8">
            {roastLines.map((line, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 ${
                  index < visibleLines 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
              >
                <p className="text-gray-100 text-lg leading-relaxed p-4 bg-gray-800/30 rounded-lg border-l-4 border-red-500/50 hover:border-red-400 transition-colors duration-300">
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleTextToSpeech}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
            >
              {isPlaying ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Stop Reading' : 'Read Aloud'}
            </Button>
            
            <Button
              onClick={handleCopyRoast}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Roast
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Roast Button */}
      <div className="text-center">
        <Button
          onClick={onNewRoast}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 text-lg transition-all duration-300 transform hover:scale-105"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Get Roasted Again!
        </Button>
        <p className="text-gray-400 mt-2 text-sm">Feeling brave enough for another round?</p>
      </div>
    </div>
  );
};

export default RoastResult;