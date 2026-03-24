The Big Picture                        
                                                                     
  You already have the data (profile + job descriptions in Supabase).
   The workflow is:                                                  
                                                                     
  Admin clicks "Analyze" → API route fetches all profile data + job  
  description                                                        
  → Claude Opus generates: match score + cover letter + CV
  suggestions                                                        
  → Results stored in job_ai_analyses table → Admin                  
  views/edits/copies                                                 
                                                                     
  ---                                                                
  Phase 1 — MVP (2 days of work)                            
                                                                     
  New table: job_ai_analyses                                         
  job_application_id → references job_applications                   
  status             → pending | generating | completed | failed     
  match_score        → 0-100                                         
  match_analysis     → jsonb (strengths, gaps, keywords)    
  cover_letter       → text (markdown)                               
  cv_suggestions     → jsonb (highlight, rephrase, reorder, omit)
  cover_letter_edited → text (your edited version)                   
                                                                     
  New files:                                                         
                                                                     
  ┌───────────────────────────────────────┬───────────────────────┐
  │                 File                  │     What it does      │  
  ├───────────────────────────────────────┼───────────────────────┤
  │                                       │ Assembles all your    │
  │ src/lib/ai/profile-context.ts         │ Supabase profile data │
  │                                       │  into a prompt        │  
  ├───────────────────────────────────────┼───────────────────────┤
  │                                       │ Calls Claude via AI   │  
  │ src/lib/ai/analyze-job.ts             │ SDK, returns          │
  │                                       │ structured output     │  
  ├───────────────────────────────────────┼───────────────────────┤
  │ src/app/api/admin/ai/analyze/route.ts │ POST to trigger       │
  │                                       │ generation            │
  ├───────────────────────────────────────┼───────────────────────┤
  │                                       │ UI to display match   │
  │ src/app/admin/JobAnalysisPanel.tsx    │ score, cover letter,  │  
  │                                       │ CV suggestions        │
  └───────────────────────────────────────┴───────────────────────┘  
                                                            
  The AI prompt sends your full profile (experiences, projects,      
  skills, education) + the job description to Claude Opus, and gets
  back structured JSON: match score, strengths/gaps analysis, a      
  tailored cover letter, and specific CV bullet point suggestions.
                   
  Cost per analysis: ~4,000-7,000 tokens = roughly $0.05-0.10 per    
  job. Very cheap.
                                                                     
  ---                                                       
  Phase 2 — Polish (1 week)
                           
  - Editable cover letter (toggle markdown ↔ textarea, save edits)
  - Checkboxes to accept/reject individual CV suggestions            
  - Streaming output so you see results appear live instead of
  waiting 30s                                                        
  - Re-generate (keeps history — each run is a new row)     
  - PDF export using the existing @react-pdf/renderer setup          
                                                                     
  ---                                                                
  Phase 3 — Long-term vision                                         
                                                            
  - Job URL scraper (paste a link instead of raw text)
  - Interview prep generator (likely questions based on gaps)        
  - Email drafter (follow-up, post-interview, offer negotiation)
  - Multi-model comparison (Claude vs GPT side-by-side)              
  - Cron job to monitor job boards and auto-analyze new matches
                                                                     
  ---                                                       
  Key decisions Opus made                                            
                                                            
  - No WDK needed for Phase 1 — a single Claude call takes 20-30s,
  well within Vercel's 60s function limit. WDK only makes sense in   
  Phase 3 when you have multi-step human-in-the-loop flows.
  - One AI call, not three — match analysis + cover letter + CV      
  suggestions all in one generateObject() with a Zod schema. Simpler 
  and faster.      
  - History over overwrite — each "Analyze" creates a new row, never 
  overwrites. You can compare prompt iterations.                     
  - API routes, not server actions — server actions aren't designed
  for long-running generation.                                       
                                                            
  ---                                                                
  Want me to start building Phase 1? I can implement the database
  migration, AI lib, API route, and the analysis panel component.   