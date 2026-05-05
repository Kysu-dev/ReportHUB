type CitizenPageTitleProps = {
  title: string;
  className?: string;
  accentClassName?: string;
};

export default function CitizenPageTitle({
  title,
  className = "",
  accentClassName = "bg-[#22C55E]",
}: CitizenPageTitleProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`absolute inset-0 -rotate-2 translate-x-2 translate-y-2 border-4 border-black ${accentClassName}`}
        aria-hidden="true"
      />
      <div className="relative z-10 border-4 border-black bg-white px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-[28px] md:text-[40px] lg:text-[48px] font-extrabold uppercase leading-none tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}
