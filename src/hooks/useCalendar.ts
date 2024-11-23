import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { TimeSlot } from '../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function useCalendar(selectedDate: string) {
  const queryClient = useQueryClient();

  const { data: timeSlots, isLoading, error } = useQuery({
    queryKey: ['timeSlots', selectedDate],
    queryFn: () => apiService.getTimeSlots(selectedDate),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
    gcTime: 1000 * 60 * 60, // Keep unused data for 1 hour
  });

  const { data: isDateAvailable } = useQuery({
    queryKey: ['dateAvailability', selectedDate],
    queryFn: async () => {
      const slots = await apiService.getTimeSlots(selectedDate);
      return slots.some(slot => slot.available);
    },
    enabled: !!selectedDate,
    retry: 1,
    gcTime: 1000 * 60 * 60,
  });

  const { mutate: reserve } = useMutation({
    mutationFn: async ({ date, slotId, email }: { date: string; slotId: string; email: string }) => {
      return apiService.createBooking({
        date: format(new Date(date), 'yyyy-MM-dd'),
        timeSlot: slotId,
        email,
        firstName: '', // These will be updated later in the booking process
        lastName: '',
        phone: ''
      });
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