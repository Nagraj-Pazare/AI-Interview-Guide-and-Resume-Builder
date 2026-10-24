import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { useContext, useEffect, useCallback } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.error("Generate report error:", error);
            throw error;
        } finally {
            setLoading(false);
        }

        return response?.interviewReport;
    };

    const getReportById = useCallback(async (id) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(id);
            if (response?.interviewReport) {
                setReport(response.interviewReport);
            }
        } catch (error) {
            console.error("Get report by ID error:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    }, [setLoading, setReport]);

    const getReports = useCallback(async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            if (response?.interviewReports) {
                setReports(response.interviewReports);
            }
        } catch (error) {
            console.error("Get reports error:", error);
        } finally {
            setLoading(false);
        }

        return response?.interviewReports || [];
    }, [setLoading, setReports]);

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const response = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Download resume error:", error);
            alert("Failed to download resume PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [ interviewId, getReportById, getReports ]);

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
};
