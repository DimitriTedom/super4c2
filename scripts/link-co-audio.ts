import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "lib", "exam", "series-co-101.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Look for questions where questionNumber is defined and audioUrl is not yet present
let count = 0;
content = content.replace(
  /([ \t]+id: "co-101-q(\d+)",\r?\n[ \t]+questionNumber: \2,\r?\n[ \t]+nclcTargetLevel: \d+,)(?!\r?\n[ \t]+audioUrl:)/g,
  (match, p1, qNum) => {
    count++;
    return `${p1}\n    audioUrl: "/audio/co/co-101-q${qNum}.mp3",`;
  }
);

fs.writeFileSync(filePath, content, "utf-8");
console.log(`✅ ${count} question(s) mise(s) à jour avec leur champ audioUrl dans series-co-101.ts !`);
