"use client";

import {
  createAudienceListAction,
  updateAudienceListAction,
  deleteAudienceListAction,
  createContactAction,
  updateContactAction,
  deleteContactAction,
  importContactsAction,
} from "./actions";
import { Upload, PlusCircle, Trash2, Edit2, Users, FilePlus } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Hardcoded audience, contact types for beta
type AudienceList = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};
type Contact = {
  id: string;
  email: string;
  name?: string;
  tags?: string;
  unsubscribed?: boolean;
  createdAt?: string;
};

type Props = {
  status: string | null;
  message: string | null;
  items: AudienceList[];
  contacts: Contact[];
  activeListId: string | null;
  canManage: boolean;
};

export default function Client({
  status,
  message,
  items,
  contacts,
  activeListId,
  canManage,
}: Props) {
  // List/Contact dialog local states
  const [openCreateList, setOpenCreateList] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [editList, setEditList] = useState<AudienceList | null>(null);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);

  return (
    <section className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audience Lists</span>
            {canManage && (
              <span className="flex gap-2">
                <Button onClick={() => setOpenCreateList(true)}>
                  <PlusCircle className="mr-2" /> New List
                </Button>
                <Button variant="secondary" onClick={() => setOpenImport(true)}>
                  <Upload className="mr-2" /> Import CSV
                </Button>
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Organize and manage your audiences. Import or manually add contacts.
          </CardDescription>
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
              <p className="text-lg font-semibold mb-2">No audience lists yet</p>
              <p className="text-muted-foreground mb-4">
                Import a CSV or add contacts to start growing your reach.
              </p>
              {canManage && (
                <span className="flex gap-3 justify-center">
                  <Button onClick={() => setOpenImport(true)}>
                    <Upload className="mr-2" /> Import CSV
                  </Button>
                  <Button variant="secondary" onClick={() => setOpenCreateList(true)}>
                    <PlusCircle className="mr-2" /> New List
                  </Button>
                </span>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>{list.name}</TableCell>
                    <TableCell>{list.description || "-"}</TableCell>
                    <TableCell>
                      {list.createdAt ? new Date(list.createdAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {canManage && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditList(list)}
                          >
                            <Edit2 className="size-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeleteListId(list.id)}
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
      {/* Creation, edit, delete dialogs for audience lists, contact table/import to follow... */}
    </section>
  );
}