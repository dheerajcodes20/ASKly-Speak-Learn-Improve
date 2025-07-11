import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../components/ui/dialog';
import { CoachingExpert, CoachingOptions } from '../../../../services/options';
import { Textarea } from '../../../../components/ui/textarea'
import Image from 'next/image'
import { Button } from '../../../../components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { LoaderCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { useUser } from '@stackframe/stack'


function UserInputDialog({children,coachingOption}) {

  const [selectedExpert, setSelectedExpert] = useState('');
  const [topic, setTopic] = useState('');
  const createDiscussionRoom= useMutation(api.DiscussionRoom.CreateNewRoom);
  const [loading,setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router= useRouter();
  const user = useUser();

  const OnClickNext=async()=>{
    try {
      setLoading(true);
      // Find the selected expert's full information
      const expert = CoachingExpert.find(exp => exp.name === selectedExpert);
      
      if (!expert) {
        throw new Error('Please select a coaching expert');
      }

      const result = await createDiscussionRoom({
        coachingOption: coachingOption.name,
        topic: topic,
        expertName: expert.name, // This will be used to get the correct Polly voice
        userId: user?.id,
        title: topic || `${coachingOption.name} with ${expert.name}`,
      });

      if (result?._id) {
        router.push(`/discussion-room/${result._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDialogOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTopic('');
      setSelectedExpert('');
      setLoading(false);
    }
  }

  return (
    <div>
       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger asChild>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{coachingOption.name}</DialogTitle>
      <DialogDescription asChild>
      <div className='mt-3'>
        <h2 className='text-black'>Enter a topic to master your skills in {coachingOption.name}</h2>
        <Textarea
          placeholder="Enter your topic here..."
          className="mt-2"
          value={topic}
          onChange={(e)=>setTopic(e.target.value)}
        />

        <h2 className='text-black  mt-5'>Select your coaching expert</h2>

        <div className='grid grid-cols-3 md:grid-cols-5  gap-6 mt-3'>
            {CoachingExpert.map((expert, index) => (
                <div key={index} onClick={()=>setSelectedExpert(expert.name)} >
                <Image
                  src={expert.avatar}
                  alt={expert.name}
                  width={100}
                  height={100}
                  className={`rounded-2xl h-[80px] w-[80px] object-cover hover:scale-105 transition-all cursor-pointer p-1 border-primary ${selectedExpert === expert.name ? 'border-2' : ''}`}
                />
                <h2 className='pl-5 font-semibold'>{expert.name}</h2>
                </div>
            ))}
        </div>
        <div className='flex gap-5 justify-end mt-5'>
            <DialogClose asChild>
                <Button variant={'ghost'}>Cancel</Button>
            </DialogClose>
            <Button disabled={(!topic || !selectedExpert || loading)} onClick={OnClickNext}>
              {loading && <LoaderCircle className='animate-spin'/>} Next
            </Button>
        </div>
      </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default UserInputDialog
