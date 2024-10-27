import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const eventSchema = z.object({
  name: z.string().nonempty("Event name is required"),
  description: z.string().nonempty("Description is required"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date",
  }),
});
type signin = z.infer<typeof eventSchema>;
import { Button } from "./ui/button";
import { RiPulseAiFill } from "@remixicon/react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { backend_url } from "@/constant";
const AddDialog = ({ refetch, setRefetch }: any) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signin>({
    // defaultValues: {
    //   email: "blaganarpit@gmail.com",
    //   password: "Ab@123456",
    // },
    resolver: zodResolver(eventSchema),
  });
  const onSubmit: SubmitHandler<signin> = async (data) => {
    setLoading(true);
    try {
      const startTime = new Date(data.startTime).toISOString();
      const endTime = new Date(data.endTime).toISOString();
      await axios.post(
        backend_url + "/create-event",
        {
          name: data.name,
          description: data.description,
          startTime,
          endTime,
        },
        { withCredentials: true }
      );
      setIsOpen(false);
      setRefetch(!refetch);
    } catch (err) {
      toast.error(
        "Not able to add event something went wrong please try again later 🥲."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="bg-green-600 hover:bg-green-500">
          <RiPulseAiFill /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="font-first">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Create a new event
          </DialogTitle>
          <DialogDescription>
            <p>
              Just need to provide some required info about the event and click
              on add that's it.
            </p>
            <form
              className="my-5 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="text-black dark:text-white">
                  Event's name
                </label>
                <Input
                  placeholder="Interview for Full stack intern position"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-black dark:text-white">
                  Event's description
                </label>
                <Input
                  placeholder="A call to discuss candidate's experience and test their skills"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="flex md:flex-row flex-col md:justify-between">
                <div>
                  <label className="text-black dark:text-white">
                    Start time
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("startTime")}
                    className={`border-2 rounded-md p-2 
                      
                        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500
                        bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500"
                    `}
                  />
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">
                      {errors.startTime.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-black dark:text-white">End time</label>
                  <Input
                    type="datetime-local"
                    {...register("endTime")}
                    className={`border-2 rounded-md p-2 
                      
                        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500
                        bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500"
                    `}
                  />
                  {errors.endTime && (
                    <span className="text-red-500 text-sm">
                      {errors.endTime.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500"
                  disabled={loading}
                >
                  {loading ? "Adding" : "Add"}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
