import React from "react";
import { enrichmentData } from "../data/enrichmentData";
import { MESSAGES } from "./constants/messages";

interface EnrichmentPanelProps {
    fruit: string;
}

const EnrichmentPanel: React.FC<EnrichmentPanelProps> = ({ fruit }) => {
    return (
        <div>
            <strong>{fruit} Enrichment</strong>
            <div style={{ marginTop: 8 }}>
                {enrichmentData[fruit] || MESSAGES.NO_ENRICHMENT_DATA}
            </div>
        </div>
    );
};

export default EnrichmentPanel;
