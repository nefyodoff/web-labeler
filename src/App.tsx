import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Popup from "./pages/Popup";
import OptionsPage from "./pages/OptionsPage";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "./style.scss";
import { OptionsProvider } from "./options/context.tsx";

//TODO:
// ☑️ 1. Opacity and isActive props for Labels
// ☑️ 2. Multi rules for one label
// ☑️ 3. Default labels (for the first launch)
// ☑️ 4. Label preview in edit form
// ☑️ 5. Import/export setting from/to file
// 6. Import setting from url
// 6.1 By user action (sync button)
// 6.2 By timer (autoupdate)
// ☑️ 7. Draggable labels in the list
// 8. UI improvements:
// 8.1 user friendly position selector in the edit form,
// 8.2 ribbon/triangle icons for labels in the edit form and in the labels' badges
// ☑️ 8.3 confirmation dialog on delete label and delete all actions
// ☑️ 8.4 add on/off control for each label into the popup
// 8.5 fix mobile version UI issues
// 9. Support regexp or special symbols like *
// ☑️ 10. Dark mode
// 11. Tooltip features:
// 11.1 UI control for switching between label positions
// 11.2 Quick add active tab url to specific label rule

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <OptionsProvider>
        <ModalsProvider>
          {window.location.hash === "#popup" ? <Popup /> : <OptionsPage />}
        </ModalsProvider>
      </OptionsProvider>
    </MantineProvider>
  );
}

export default App;
