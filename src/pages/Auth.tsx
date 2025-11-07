import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import owlMascot from "@/assets/owl-mascot.png";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !classCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and class code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a unique email from name and class code
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}.${classCode}@studyowl.local`;
      const password = `${classCode}-${name}`;

      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If sign in fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              class_code: classCode,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signUpError) throw signUpError;

        toast({
          title: "Welcome! 🎉",
          description: `Account created for ${name}`,
        });
      } else {
        toast({
          title: "Welcome back! 👋",
          description: `Logged in as ${name}`,
        });
      }

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8 bg-card border-2 border-accent/20">
        <div className="text-center space-y-4">
          <img src={owlMascot} alt="StudyOwl" className="w-24 h-24 mx-auto" />
          <h1 className="text-4xl font-bold text-accent">StudyOwl</h1>
          <p className="text-muted-foreground">Enter your details to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-14 text-lg bg-background border-2 border-accent/30 focus:border-accent"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Class Code"
              className="h-14 text-lg bg-background border-2 border-accent/30 focus:border-accent"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
