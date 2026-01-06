"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workspace } from '../types'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WorksapceJoinViewProps {
  workspace: Workspace;
  inviteCode: string;
}
export default function WorksapceJoinView({ workspace, inviteCode }: WorksapceJoinViewProps) {

  const {mutate: joinWorkspace, isPending: isJoining} = useJoinWorkspace();

  const queryClient = useQueryClient();
  const router = useRouter();
  const handleJoinClick = () => {
    joinWorkspace({json: {inviteCode }, param: {workspaceId: workspace.$id} }, {
      onSuccess: (data) => {
        toast.success(`You have joined ${data.name}`);
        queryClient.invalidateQueries({queryKey: ['workspaces']})
        queryClient.invalidateQueries({ queryKey: ["workspace", data.$id]});
        router.push(`/workspaces/${data.$id}`)
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  }
 
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          {`You are about to join`} <strong>{workspace.name}</strong>
        </CardDescription>
      </CardHeader>
      {/* <Separator/> */}
      <CardContent>
        <div className="flex flex-col gap-2  lg:flex-row items-center justify-between">
          <Button
            className="w-full lg:w-fit cursor-pointer"
            variant={"secondary"}
            type="button"
            size={"lg"}
            disabled={isJoining}
            asChild
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit cursor-pointer"
            size={"lg"}
            type="button"
            disabled={isJoining}
            onClick={() => handleJoinClick()}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
