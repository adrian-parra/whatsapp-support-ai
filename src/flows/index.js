import { welcomeFlow } from './welcome/welcome.flow.js'
import { supportFlow } from './support/support.flow.js'
import { hardwareReportFlow } from './support/hardware.flow.js'
import { softwareReportFlow } from './support/software.flow.js'
import { equipmentRequestFlow } from './equipment/request.flow.js'
import { equipmentStatusFlow } from './equipment/status.flow.js'
export { equipmentRequestFlow } from './equipment/request.flow.js'
export { equipmentStatusFlow } from './equipment/status.flow.js'
import { statusChecadoresFlow } from './gestionPlantas/equipos.flow.js'
// import { networkHelpFlow } from './support/network.flow.js'
// import { ticketStatusFlow } from './tickets/status.flow.js'
// import { feedbackFlow } from './tickets/feedback.flow.js'
// import { surveyFlow } from './tickets/survey.flow.js'
// import { equipmentRequestFlow } from './equipment/request.flow.js'
// import { diagnosticFlow } from './utils/diagnostic.flow.js'
// import { voiceFlow } from './utils/voice.flow.js'




export const flows = [
    welcomeFlow,
    supportFlow,
    hardwareReportFlow,
    softwareReportFlow,
    equipmentRequestFlow,
    equipmentStatusFlow,
    statusChecadoresFlow
    // networkHelpFlow,
    // ticketStatusFlow,
    // feedbackFlow,
    // surveyFlow,
    // equipmentRequestFlow,
    // diagnosticFlow,
    // voiceFlow
]
