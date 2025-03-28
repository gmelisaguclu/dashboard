"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { toast } from "sonner";
import {
  createFAQ,
  deleteFAQ,
  FAQ,
  getFAQs,
  updateFAQ,
} from "@/data/actions/faqAction";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    const { data, error } = await getFAQs();
    if (error) {
      toast.error(error);
    } else if (data) {
      setFaqs(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Lütfen soru ve cevap alanlarını doldurun");
      return;
    }

    setIsProcessing(true);
    const { error } = await createFAQ(question, answer);
    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("FAQ başarıyla eklendi");
      setIsAddDialogOpen(false);
      setQuestion("");
      setAnswer("");
      await loadFAQs();
    }
  };

  const handleUpdate = async () => {
    if (!selectedFAQ) return;

    if (!question.trim() || !answer.trim()) {
      toast.error("Lütfen soru ve cevap alanlarını doldurun");
      return;
    }

    setIsProcessing(true);
    const { error } = await updateFAQ(selectedFAQ.id, question, answer);
    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("FAQ başarıyla güncellendi");
      setIsEditDialogOpen(false);
      setSelectedFAQ(null);
      await loadFAQs();
    }
  };

  const handleDelete = async () => {
    if (!selectedFAQ) return;

    setIsProcessing(true);
    const { error } = await deleteFAQ(selectedFAQ.id);
    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("FAQ başarıyla silindi");
      setIsDeleteAlertOpen(false);
      setSelectedFAQ(null);
      await loadFAQs();
    }
  };

  const openEditDialog = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setQuestion(faq.question_text);
    setAnswer(faq.answer_text);
    setIsEditDialogOpen(true);
  };

  const openDeleteAlert = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDeleteAlertOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDeleteAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleDelete();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Yönetimi</h1>
        {faqs.length > 0 && (
          <Button
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setIsAddDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni FAQ Ekle
          </Button>
        )}
      </div>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CardDescription className="text-center mb-4 text-lg">
              Henüz hiç FAQ eklenmemiş
            </CardDescription>
            <Button
              onClick={() => {
                setQuestion("");
                setAnswer("");
                setIsAddDialogOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk FAQ'yu Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sık Sorulan Sorular Listesi</CardTitle>
            <CardDescription>
              Sitede gösterilen soru ve cevapları yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Soru</TableHead>
                    <TableHead className="w-[400px]">Cevap</TableHead>
                    <TableHead className="w-[180px]">Oluşturulma</TableHead>
                    <TableHead className="w-[180px]">Güncelleme</TableHead>
                    <TableHead className="text-right w-[120px]">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="align-top font-medium">
                        {truncateText(faq.question_text, 70)}
                      </TableCell>
                      <TableCell className="align-top">
                        {truncateText(faq.answer_text, 100)}
                      </TableCell>
                      <TableCell className="align-top">
                        {formatDate(faq.created_at)}
                      </TableCell>
                      <TableCell className="align-top">
                        {formatDate(faq.updated_at || faq.created_at)}
                      </TableCell>
                      <TableCell className="text-right align-top whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(faq)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteAlert(faq)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ekleme Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Yeni FAQ Ekle</DialogTitle>
            <DialogDescription>
              Siteye yeni bir soru ve cevap ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="question" className="font-medium">
                Soru
              </label>
              <Input
                id="question"
                placeholder="Soruyu girin"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="answer" className="font-medium">
                Cevap
              </label>
              <Textarea
                id="answer"
                placeholder="Cevabı girin"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isProcessing}
            >
              İptal
            </Button>
            <Button onClick={handleCreate} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                "Ekle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Düzenleme Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>FAQ Düzenle</DialogTitle>
            <DialogDescription>
              Soru ve cevap detaylarını güncelleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-question" className="font-medium">
                Soru
              </label>
              <Input
                id="edit-question"
                placeholder="Soruyu girin"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-answer" className="font-medium">
                Cevap
              </label>
              <Textarea
                id="edit-answer"
                placeholder="Cevabı girin"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              İptal
            </Button>
            <Button onClick={handleUpdate} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                "Güncelle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Silme Onay Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bu FAQ'yi silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu soruyu ve cevabını kalıcı olarak
              sileceksiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAction}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Evet, Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
