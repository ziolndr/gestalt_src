// app/components/Logo.tsx
export default function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
      <path d="M20 20 L50 10 L80 20 L90 50 L80 80 L50 90 L20 80 L10 50 Z" fill="#2A2A2A"/>
      <path d="M35 40 L65 40 L65 60 L50 70 L35 60 Z" fill="none" stroke="#FFFFFF" strokeWidth="5"/>
      <circle cx="50" cy="30" r="5" fill="#FFFFFF"/>
    </svg>
  );
}