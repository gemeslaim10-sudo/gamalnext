import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { SkillsForm, defaultSkillsData } from "./types";

export function useSkillsAdmin() {
    const { register, control, handleSubmit, setValue, formState: { isSubmitting } } = useForm<SkillsForm>({
        defaultValues: defaultSkillsData
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "mainSkills" });
    const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: "techStack" });
    const { fields: softFields, append: appendSoft, remove: removeSoft } = useFieldArray({ control, name: "software" });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "skills"));
                if (snap.exists()) {
                    const data = snap.data() as SkillsForm;
                    setValue("mainSkills", data.mainSkills || []);
                    setValue("techStack", data.techStack || []);
                    setValue("software", data.software || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: SkillsForm) => {
        try {
            await setDoc(doc(db, "site_content", "skills"), data);
            toast.success("Skills updated!");
        } catch (e) {
            toast.error("Error saving.");
        }
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        loading,
        skillFields,
        appendSkill,
        removeSkill,
        techFields,
        appendTech,
        removeTech,
        softFields,
        appendSoft,
        removeSoft
    };
}
