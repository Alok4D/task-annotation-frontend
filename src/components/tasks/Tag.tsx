export const Tag = ({ label }: { label: string }) => {
  return (
    <span className="px-2 py-1 bg-[#1E2228] text-[#8B929D] rounded text-[10px] font-medium border border-[#3A414B]">
      {label}
    </span>
  );
};
