import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main(){
  const author=await db.user.upsert({where:{email:'campus-desk-demo@seed.invalid'},update:{},create:{id:'demo-author',email:'campus-desk-demo@seed.invalid',name:'Campus Desk demo author',bio:'Seeded demonstration account. Cannot sign in.'}});
  const term=await db.academicTerm.upsert({where:{name:'Demo · Autumn 2026'},update:{},create:{id:'demo-term-2026',name:'Demo · Autumn 2026',startsOn:new Date('2026-08-01T00:00:00.000Z'),endsOn:new Date('2026-12-31T00:00:00.000Z')}});
  const cohorts=await Promise.all(['A','B'].map(section=>db.cohort.upsert({where:{termId_programme_semester_section:{termId:term.id,programme:'B.Tech CSE (demo)',semester:3,section}},update:{},create:{id:`demo-cohort-${section.toLowerCase()}`,termId:term.id,programme:'B.Tech CSE (demo)',semester:3,section}})));
  const topics:[string,string,string][]=[
    ['CAMPUS','Welcome to the demo campus desk','This is a demonstration discussion. Share campus updates with your classmates here.'],
    ['QUESTION','Where should course questions go?','Use the Questions category for short queries that other students can help answer.'],
    ['RESOURCE','A sample resource sharing thread','Post useful notes or links here. Verify materials with your instructor before relying on them.'],
    ['ACADEMICS','How to organize a study group','Use a clear title and include the course when planning a study session.'],
    ['CAMPUS','Ideas for a student noticeboard','What kinds of campus information would make your week easier?'],
    ['ACADEMICS','Getting ready for the next module','This is a sample academic conversation, not an official course announcement.'],
    ['QUESTION','How do I update my section?','Open Profile settings and choose your cohort from the section selector.'],
    ['RESOURCE','A place for project checklists','Share your own checklists and tips with the community.']
  ];
  for(let i=0;i<topics.length;i++){const [category,title,body]=topics[i];const discussion=await db.discussion.upsert({where:{id:`demo-discussion-${i+1}`},update:{},create:{id:`demo-discussion-${i+1}`,authorId:author.id,category:category as 'CAMPUS'|'QUESTION'|'RESOURCE'|'ACADEMICS',title,body,isDemo:true,createdAt:new Date(Date.now()-(topics.length-i)*86400000)}});for(let j=0;j<(i<4?3:2);j++){await db.reply.upsert({where:{id:`demo-reply-${i+1}-${j+1}`},update:{},create:{id:`demo-reply-${i+1}-${j+1}`,discussionId:discussion.id,authorId:author.id,body:`Demo reply ${j+1}: this is example content for testing the conversation view.`,createdAt:new Date(Date.now()-(topics.length-i)*86400000+(j+1)*3600000)}})}}
  const notices:[string,string,string,boolean][]=[['GENERAL','Welcome to the demo noticeboard','This is a sample notice for exploring Campus Desk. It is not an official NSUT announcement.',true],['ACADEMIC','How timetable publishing works','A demo schedule is included so you can try the weekly and daily views. Confirm real classes through official channels.',false],['EVENT','Sample campus activity notice','This is example content only. No real event is being advertised.',false],['DEADLINE','Draft example: deadline','An unpublished example draft.',false],['GENERAL','Draft example: general','An unpublished example draft.',false]];
  for(let i=0;i<notices.length;i++){const [category,title,body,pinned]=notices[i];await db.announcement.upsert({where:{id:`demo-notice-${i+1}`},update:{},create:{id:`demo-notice-${i+1}`,authorId:author.id,category:category as 'GENERAL'|'ACADEMIC'|'EVENT'|'DEADLINE',title,body,status:i<3?'PUBLISHED':'DRAFT',isPinned:pinned,isDemo:true,publishedAt:i<3?new Date(Date.now()-(3-i)*86400000):null}})}
  for(const cohort of cohorts){await db.timetable.upsert({where:{cohortId:cohort.id},update:{},create:{id:`demo-timetable-${cohort.section.toLowerCase()}`,cohortId:cohort.id,updatedById:author.id,isDemo:true,entries:{create:[1,2,3,4,5].flatMap(weekday=>[{weekday,startMinute:540,endMinute:600,courseCode:'DEMO 101',courseTitle:'Sample lecture',room:'Demo room A',instructor:'Demo instructor'},{weekday,startMinute:630,endMinute:690,courseCode:'DEMO 102',courseTitle:'Sample seminar',room:'Demo room B',instructor:null}])}}})}
}
main().then(()=>console.log('Idempotent demo seed complete.')).finally(()=>db.$disconnect());
