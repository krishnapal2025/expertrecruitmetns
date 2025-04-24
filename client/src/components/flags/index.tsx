import React from "react";

type FlagProps = {
  className?: string;
};

export function IndiaFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
    </div>
  );
}

export function UAEFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
    </div>
  );
}

export function USAFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
    </div>
  );
}