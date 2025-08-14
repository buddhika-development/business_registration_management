// src/components/ui/Title/MainTitle.jsx
export default function Title({ title, children, className = "" }) {
    const content = children ?? title;
    return (
      <h1 className={`leading-tight ${className}`}>
        {content}
      </h1>
    );
  }
  