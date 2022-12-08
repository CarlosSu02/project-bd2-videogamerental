
import Report from '../models/report.model';

export const getReports = async (_id_company: string) => {

    const reports = await Report.find({ _id_company });
    
    if (reports.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not reports added!' }));

    return {
        code: 200,
        count: reports.length,
        results: reports
    };

};
