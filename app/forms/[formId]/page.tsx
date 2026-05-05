import FormBuilder from "@/components/Form/FormBuilder";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface PageProps {
  params: Promise<{ formId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { formId } = await params;

  return (
    <ProtectedRoute>
      <div className="pt-20 w-full flex flex-1">
        <FormBuilder formId={parseInt(formId)} />
      </div>
    </ProtectedRoute>
  );
};

export default page;
