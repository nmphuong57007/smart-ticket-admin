// /api/hooks/use-genre-update.ts
import { useMutation } from "@tanstack/react-query";
import { updateGenre } from "../services/genre-api";

export const useUpdateGenre = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; is_active?: boolean };
    }) => updateGenre(id, data),
  });
};
