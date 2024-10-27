import AddDialog from "@/components/add-dialog";
import { con } from "@/context";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ColorRing } from "react-loader-spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { backend_url, readableFormat } from "@/constant";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Playground = () => {
  const data = useContext(con);
  const navigate = useNavigate();
  useEffect(() => {
    data.setCheck(!data.check);
    if (data.isLoggedIn) {
      toast(`Welcome ${data.user.name} to Clandy ❤️.`);
    }
  }, []);

  const [date, setDate] = useState<Date>(new Date());
  const [refetch, setRefetch] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        // Format date to YYYY-MM-DD for backend API
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const res = await axios.get(
          `${backend_url}/events${formattedDate}`, // Using query params
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        setEvents(res.data);
      } catch (err) {
        toast.error(
          `Something went wrong while fetching events for ${readableFormat(
            date
          )}.`
        );
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [date, refetch]);

  return (
    <div className="h-screen mx-5 font-first relative">
      <div className="flex items-center justify-between border-b py-2">
        <div>
          <p className="text-2xl font-semibold">Calendar events</p>
          <p className="text-gray-500">User-friendly UI, easy to use.</p>
        </div>
        <AddDialog refetch={refetch} setRefetch={setRefetch} />
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    // Normalize the date to remove time information
                    const normalizedDate = new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate()
                    );
                    setDate(normalizedDate);
                    setIsOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {!loading && (
          <Table>
            <TableCaption>
              A list of events on{" "}
              <span className="dark:text-white text-black">
                {readableFormat(date)}
              </span>
              .
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start time</TableHead>
                <TableHead>End time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ele, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{ele.summary}</TableCell>
                    <TableCell>{ele.description}</TableCell>
                    <TableCell>{ele.start.dateTime}</TableCell>
                    <TableCell>{ele.end.dateTime}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {loading && (
          <div className="w-full flex items-center justify-center h-[40vh]">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
