export const Tag = ({ label }: { label: string }) => {
  return (
    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium border border-gray-200 shadow-sm">
      {label}
    </span>
  );
};
