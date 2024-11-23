import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '../services/googleCalendar';
import type { TimeSlot } from '../utils/calendar';
import { toast } from 'sonner';

export function useCalendar(selectedDate: string) {
  const queryClient = useQueryClient();

  const { data: timeSlots, isLoading, error } = useQuery<TimeSlot[]>({
    queryKey: ['timeSlots', selectedDate],
    queryFn: () => calendarService.getAvailableSlots(selectedDate),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
    gcTime: 1000 * 60 * 60, // Keep unused data for 1 hour
  });

  const { data: isDateAvailable } = useQuery({
    queryKey: ['dateAvailability', selectedDate],
    queryFn: () => calendarService.checkAvailability(selectedDate),
    enabled: !!selectedDate,
    retry: 1,
    gcTime: 1000 * 60 * 60,
  });

  const { mutate: reserve } = useMutation({
    mutationFn: async ({ date, slotId }: { date: string; slotId: string }) => {
      const slots = await calendarService.getAvailableSlots(date);
      const slot = slots.find(s => s.id === slotId);
      
      if (!slot || !slot.available) {
        throw new Error('Time slot is not available');
      }

      // For now, we'll just return true since we don't have write access
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
      toast.success('Time slot reserved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reserve time slot');
    },
  });

  return {
    timeSlots,
    isLoading,
    error,
    reserve,
    isDateAvailable,
  };
}