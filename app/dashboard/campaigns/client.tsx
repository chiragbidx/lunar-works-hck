"use client";

import {
  createCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
} from "./actions";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  templateId?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ClientProps = {
  status: string | null;
  message: string | null;
  items: Campaign[];
  canManage: boolean;
};

export default function Client({
  status,
  message,
  items,
  canManage,
}: ClientProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <section className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Campaigns</span>
            {canManage && (
              <Button onClick={() => setOpenCreate(true)}>
                <PlusCircle className="mr-2" /> New Campaign
              </Button>
            )}
          </CardTitle>
          <CardDescription>Your email campaigns. Create, schedule, and track delivery.</CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <div
              className={`mb-4 px-4 py-2 rounded text-sm ${
                status === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message}
            </div>
          )}
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-semibold mb-2">No campaigns yet</p>
              <p className="text-muted-foreground mb-4">
                Start by creating your first campaign to engage your startup’s audience.
              </p>
              {canManage && (
                <Button onClick={() => setOpenCreate(true)}>
                  <PlusCircle className="mr-2" /> Create Campaign
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.subject}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>
                      {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {canManage && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditCampaign(c)}
                          >
                            <Edit2 className="size-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeleteId(c.id)}
                          >
                            <Trash2 className="size-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Fill in the basics. Schedule & template support coming next.
            </DialogDescription>
          </DialogHeader>
          <form action={createCampaignAction}>
            <div className="mb-4 space-y-2">
              <Input name="name" placeholder="Campaign Name" required />
              <Input name="subject" placeholder="Subject" required />
              <Input name="scheduledAt" type="datetime-local" />
              {/* Template selection will be added after templates wiring */}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCampaign} onOpenChange={(open) => { if (!open) setEditCampaign(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editCampaign && (
            <form action={updateCampaignAction}>
              <input type="hidden" name="id" value={editCampaign.id} />
              <div className="mb-4 space-y-2">
                <Input
                  name="name"
                  defaultValue={editCampaign.name}
                  placeholder="Campaign Name"
                  required
                />
                <Input
                  name="subject"
                  defaultValue={editCampaign.subject}
                  placeholder="Subject"
                  required
                />
                <Input
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={
                    editCampaign.scheduledAt
                      ? new Date(editCampaign.scheduledAt).toISOString().slice(0, 16)
                      : ""
                  }
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteCampaignAction}>
            <input type="hidden" name="id" value={deleteId ?? ""} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}