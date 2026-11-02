export default function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex flex-col ${light ? 'text-[#f5f0e9]' : 'text-[#f5f0e9]'}`}>
      <span className="font-serif text-3xl sm:text-4xl tracking-[0.22em] leading-none">ISHARA<span className="text-[#d43b4a]">.</span></span>
      <span className={`text-[9px] tracking-[0.23em] uppercase mt-1.5 ${light ? 'text-[#9c8f89]' : 'text-[#9c8f89]'}`}>AN EXPRESSION OF YOU</span>
    </span>
  );
}
