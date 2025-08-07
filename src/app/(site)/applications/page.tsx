import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  const applications = await prisma.application.findMany({
    where: {
      userId: session?.user?.id || "",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Section className="py-24">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          color: getTextColorLoanStatus(application.status),
                          backgroundColor: getBackgroundColorLoanStatus(
                            application.status
                          ),
                          border: "none",
                        }}
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/applications/${application.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">
              No applications found
            </p>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
