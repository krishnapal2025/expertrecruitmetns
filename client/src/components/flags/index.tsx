import React from "react";

type FlagProps = {
  className?: string;
};

export function IndiaFlag({ className =  "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top orange/saffron band */}
      <div style={{ flex: 1, backgroundColor: '#FF9933' }}></div>
      
      {/* Middle white band with Ashoka Chakra */}
      <div style={{ flex: 1, backgroundColor: '#FFFFFF', position: 'relative' }}>
        <div 
          style={{ 
            position: 'absolute', 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '80%',
            maxWidth: '80px',
            maxHeight: '80px',
            aspectRatio: '1/1',
            borderRadius: '50%',
            border: '2px solid #000080',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div 
            style={{ 
              width: '85%', 
              height: '85%', 
              borderRadius: '50%', 
              backgroundColor: '#FFFFFF',
              position: 'relative',
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '25%', 
                height: '25%', 
                borderRadius: '50%', 
                backgroundColor: '#000080',
              }}
            ></div>
            {/* Simplified spokes */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '35%',
                  height: '2px',
                  backgroundColor: '#000080',
                  transformOrigin: 'left center',
                  transform: `rotate(${i * 15}deg)`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom green band */}
      <div style={{ flex: 1, backgroundColor: '#138808' }}></div>
    </div>
  );
}

export function UAEFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex', position: 'relative' }}>
      {/* Red vertical band on left */}
      <div style={{ width: '33%', backgroundColor: '#FF0000', height: '100%' }}></div>
      
      {/* Three horizontal bands */}
      <div style={{ width: '67%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, backgroundColor: '#00732F' }}></div>
        <div style={{ flex: 1, backgroundColor: '#FFFFFF' }}></div>
        <div style={{ flex: 1, backgroundColor: '#000000' }}></div>
      </div>
    </div>
  );
}

export function USAFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 13 alternating stripes */}
      {Array.from({ length: 13 }).map((_, i) => (
        <div 
          key={i} 
          style={{ 
            flex: 1, 
            backgroundColor: i % 2 === 0 ? '#BF0A30' : '#FFFFFF'
          }}
        ></div>
      ))}
      
      {/* Blue canton */}
      <div 
        style={{ 
          position: 'absolute', 
          width: '40%', 
          height: '53.85%', // 7/13 of the flag height
          backgroundColor: '#002868',
          top: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Just a simple representation of stars */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gridTemplateRows: 'repeat(4, 1fr)',
          width: '80%',
          height: '80%',
          gap: '5%'
        }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '50%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}