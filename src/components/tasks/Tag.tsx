export const Tag = ({ label }: { label: string }) => {
  return (
    <span className="px-2 py-1 bg-[#3A414B] text-[#E0E0E0] rounded text-[10px] font-medium border border-[#4a5360]">
      {label}
    </span>
  );
};
