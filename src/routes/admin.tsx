import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createDocument,
  deleteDocument,
  DocumentRecord,
  DocumentType,
  isPreviewSupported,
  loadDocuments,
  updateDocument,
} from "@/lib/document-storage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Eye, Loader2, PlusCircle, Trash2, LogOut, ArrowLeft, KeyRound } from "lucide-react";
import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

const categories: DocumentType[] = ["Notice", "Report", "Newsletter"];
const pageSize = 6;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | Bimba Nepal" },
      {
        name: "description",
        content: "Admin document upload and viewer for notices, reports, and newsletters.",
      },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>("Notice");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [formState, setFormState] = useState({
    id: "",
    title: "",
    description: "",
    type: "Notice" as DocumentType,
    fileName: "",
    fileType: "",
    fileUrl: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authenticated = window.localStorage.getItem("bimba_admin_authenticated");
      if (authenticated === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load documents if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      const loaded = loadDocuments();
      setDocuments(loaded);
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((document) => document.type === selectedCategory)
      .filter((document) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.trim().toLowerCase();
        return (
          document.title.toLowerCase().includes(query) ||
          document.description.toLowerCase().includes(query) ||
          document.fileName.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return b.createdAt.localeCompare(a.createdAt);
        }
        return a.createdAt.localeCompare(b.createdAt);
      });
  }, [documents, selectedCategory, searchTerm, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const pagedDocuments = filteredDocuments.slice((page - 1) * pageSize, page * pageSize);
  const activeDocument = activeDocumentId
    ? (documents.find((document) => document.id === activeDocumentId) ?? null)
    : null;

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginUsername === "admin" && loginPassword === "admin") {
      setIsAuthenticated(true);
      window.localStorage.setItem("bimba_admin_authenticated", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.localStorage.removeItem("bimba_admin_authenticated");
    setLoginUsername("");
    setLoginPassword("");
  };

  const resetForm = () => {
    setFormState({
      id: "",
      title: "",
      description: "",
      type: "Notice",
      fileName: "",
      fileType: "",
      fileUrl: "",
    });
    setActiveDocumentId(null);
    setFileInputKey(Date.now());
  };

  const handleEdit = (document: DocumentRecord) => {
    setFormState({
      id: document.id,
      title: document.title,
      description: document.description,
      type: document.type,
      fileName: document.fileName,
      fileType: document.fileType,
      fileUrl: document.fileUrl,
    });
    setActiveDocumentId(document.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({
        ...prev,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.description.trim()) {
      toast.error("Please enter a title and description.");
      return;
    }

    if (!formState.fileUrl) {
      toast.error("Please select a file to upload.");
      return;
    }

    setSaving(true);
    try {
      let nextDocuments: DocumentRecord[];
      if (formState.id) {
        const updated = updateDocument(formState.id, {
          title: formState.title.trim(),
          description: formState.description.trim(),
          type: formState.type,
          fileName: formState.fileName,
          fileType: formState.fileType,
          fileUrl: formState.fileUrl,
        });
        nextDocuments = loadDocuments();
        if (updated) {
          setActiveDocumentId(updated.id);
          toast.success("Document updated successfully!");
        }
      } else {
        const created = createDocument({
          title: formState.title.trim(),
          description: formState.description.trim(),
          type: formState.type,
          fileName: formState.fileName,
          fileType: formState.fileType,
          fileUrl: formState.fileUrl,
        });
        nextDocuments = loadDocuments();
        setActiveDocumentId(created.id);
        toast.success("Document uploaded successfully!");
      }
      setDocuments(nextDocuments);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save the document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const next = deleteDocument(deleteTargetId);
    setDocuments(next);
    if (activeDocumentId === deleteTargetId) {
      setActiveDocumentId(null);
    }
    setDeleteTargetId(null);
    toast.success("Document deleted successfully!");
  };

  const renderPreview = (document: DocumentRecord) => {
    if (isPreviewSupported(document.fileType)) {
      if (document.fileType.startsWith("image/")) {
        return (
          <img
            src={document.fileUrl}
            alt={document.title}
            className="h-52 w-full rounded-xl object-contain bg-muted"
          />
        );
      }
      if (document.fileType === "application/pdf") {
        return (
          <object
            data={document.fileUrl}
            type="application/pdf"
            className="h-52 w-full rounded-xl border border-border"
          >
            <div className="grid h-52 place-items-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
              PDF preview unavailable.
            </div>
          </object>
        );
      }
    }
    return (
      <div className="grid h-52 place-items-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground">
        <span className="text-center">Preview not available for this file type.</span>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bimba Nepal
            </Link>
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Log in to manage notices, reports, and newsletters
            </p>
          </div>

          <Card className="border-border bg-card/70 backdrop-blur-md shadow-lg">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                {loginError && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                    {loginError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Login as Administrator
                </Button>
                <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                  Bimba Nepal Admin Portal • Secure Local Session
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header bar for authenticated admins */}
      <header className="border-b border-border bg-card/85 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Admin Control Panel
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    Document Manager
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    Upload and manage documents
                  </h1>
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground self-start md:self-auto">
                  Local Storage only • no backend required
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Add notices, reports, and newsletters. Administrators can create, update, and delete
                documents while saving metadata and files directly to Local Storage.
              </p>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{formState.id ? "Update Document" : "Upload / Publish Document"}</CardTitle>
                <CardDescription>
                  Add a title, description, type, and file then publish instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Document Title</Label>
                      <Input
                        id="title"
                        value={formState.title}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder="Enter title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Document Type</Label>
                      <Select
                        value={formState.type}
                        onValueChange={(value) =>
                          setFormState((prev) => ({ ...prev, type: value as DocumentType }))
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue>{formState.type}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formState.description}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Short summary of the document"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">File Upload</Label>
                    <Input
                      id="file"
                      key={fileInputKey}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                      onChange={handleFileChange}
                    />
                    {formState.fileName ? (
                      <p className="text-sm text-muted-foreground font-medium">
                        Selected file: <span className="text-foreground">{formState.fileName}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Supported: PDF, DOCX, XLSX, image files, and other common docs.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">Publish Date</p>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">Last Updated Date</p>
                      <p>{formState.id ? new Date().toLocaleDateString() : "Will set on save"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset Form
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      {formState.id ? "Update Document" : "Upload Document"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-border bg-card p-6">
              <CardHeader>
                <CardTitle>Section overview</CardTitle>
                <CardDescription>
                  Quick filters for the viewer and document library.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300"
                          : "rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                      }
                    >
                      {category}s
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search documents</Label>
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search title, description, or file name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort">Sort order</Label>
                    <Select
                      value={sortOrder}
                      onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
                    >
                      <SelectTrigger id="sort">
                        <SelectValue>
                          {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card p-6">
              <CardHeader>
                <CardTitle>Active document</CardTitle>
                <CardDescription>Quick actions for selected item.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeDocument ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activeDocument.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{activeDocument.fileName}</p>
                      </div>
                      <Badge>{activeDocument.type}</Badge>
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <p>Uploaded: {new Date(activeDocument.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(activeDocument.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(activeDocument)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTargetId(activeDocument.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                      <AlertDialog
                        open={Boolean(deleteTargetId)}
                        onOpenChange={(open) => open || setDeleteTargetId(null)}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete document?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will remove the document from Local Storage permanently.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a document card below to view details and manage it.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                {selectedCategory}s
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Library</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredDocuments.length} documents found • page {page} of {pageCount}
            </div>
          </div>

          {loading ? (
            <div className="grid place-items-center rounded-3xl border border-border bg-card p-14 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : pagedDocuments.length === 0 ? (
            <Card className="border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              <CardTitle>No documents found</CardTitle>
              <CardDescription>
                Upload your first notice, report, or newsletter to see it appear in the library.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pagedDocuments.map((document) => (
                <Card
                  key={document.id}
                  className="group border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{document.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {document.description}
                        </CardDescription>
                      </div>
                      <Badge>{document.type}</Badge>
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Uploaded {new Date(document.createdAt).toLocaleDateString()}</span>
                        <span className="truncate max-w-[200px]">{document.fileName}</span>
                      </div>
                      {isPreviewSupported(document.fileType) ? (
                        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                          {renderPreview(document)}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground">
                          Preview not available
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center justify-between gap-3 p-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(document)}>
                        <Eye className="mr-2 h-4 w-4" /> View details
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTargetId(document.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                    <a
                      href={document.fileUrl}
                      download={document.fileName}
                      className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground">
              Showing {pagedDocuments.length} of {filteredDocuments.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
