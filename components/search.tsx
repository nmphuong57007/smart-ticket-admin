import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";

interface SearchProps {
  value: string;
  onChange: (v: string) => void;
  onSearch?: (v: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function Search({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm…",
  loading,
}: SearchProps) {
  const [inner, setInner] = useState(value);

  useEffect(() => {
    setInner(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(inner);
    onSearch?.(inner);
  };

  const handleClear = () => {
    setInner("");
    onChange("");
    onSearch?.("");
  };

  return (
    <form className="flex items-center gap-3 py-2" onSubmit={handleSubmit}>
      <div className="flex-1">
        <Input
          value={inner}
          onChange={(e) => setInner(e.target.value)}
          placeholder={placeholder}
          aria-label="Tìm kiếm"
          className="h-12 text-base px-4"
        />
      </div>

      {inner && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
          title="Xóa"
          className="h-12 w-12"
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-12 px-6 text-base font-medium flex items-center gap-2"
      >
        {loading ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <>
            <SearchIcon className="h-5 w-5" />
            Tìm
          </>
        )}
      </Button>
    </form>
  );
}
