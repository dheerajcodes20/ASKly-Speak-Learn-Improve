1.  install next.js
    a. npx create-next-app@latest
    b. npm run dev

2.  Install shadcn for custom css components
    a. npx shadcn@latest init
    then consider use --force

    b. npx shadcn@latest add button
    The command above will add the Button component to your project. You can then import it like this:

              import { Button } from "@/components/ui/button"

              export default function Home() {
              return (
                  <div>
                  <Button>Click me</Button>
                  </div>
              )
              }

3.  Install Stackauth for user authentication
    a. firstly, sign in google ->create project
    b. copy the API key to .env.local file(create .env.local file) ->save the fileafter copying -> click continue on shadcn
    c. Go to documentation page in shadcn website and click on "set up and installation" and then go "setup wizard (recommended)" and execute the following commands ,  
     ->npx @stackframe/init-stack@latest -> y to install


4. open convex docs and in that click on Next.js 
    a. Run "npm install convex" and then run "npx convex dev" and it tells to login and ask to open browser with a link and you type y to open the browser if it stucks then you manually open the link in the browser then it shows
    b. create provider.jsx file in app folder of your project and import this "import { ConvexProvider, ConvexReactClient } from "convex/react";" and use "const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);" and add {children} as prompt and wrap the <ConvexProvider client={convex}>{children}</ConvexProvider> in div  
    and this process will automatically write to .env.local this,
        # Deployment used by npx convex dev
    CONVEX_DEPLOYMENT=dev:ardent-meadowlark-913 # team: dheerajcodes20, project: Interactive-Genie

    NEXT_PUBLIC_CONVEX_URL=https://ardent-meadowlark-913.convex.cloud

5. create a schema.js fileting heading 

7. Install docker desktop of AMD64 and ok with all default settings. If WSL2 version is not set as default then run this "wsl --set-default-version 2" ,This makes WSL 2 the default for all distros Docker needs.Then reopen the docker desktop 

     ->then click the link in Docker configuration heading and download the docker-compose.yml file and copy the downloaded file and paste it in your project directory 

     ->Then, to start the backend and dashboard:
                  run "docker compose up"
     ->Once the backend is running you can use it to generate admin keys for the dashboard/CLI:    
       run "docker compose exec backend ./generate_admin_key.sh"  
     This will generate a admin key and open this link http://localhost:6791 and it gives login page and enter the admin key and login


     ->In your Convex project, add your url and admin key to a .env.local file (which should not be committed to source control) and comment the Deployment used by npx convex dev:

       CONVEX_SELF_HOSTED_URL='the url'
       CONVEX_SELF_HOSTED_ADMIN_KEY='<your admin key>'

     And again run "npx convex dev"
     https://www.design.com/maker/drafts/d2e7724b-e5f6-42e2-94e5-ef2652c60f80/share


     


       setConversation(finalConversation);
        
        // Save the final conversation with both messages
        if (roomid) {
          await UpdateConversation({
            id: roomid,
            conversation: finalConversation,
          });
        }

        // Convert AI response to speech
        if (aiMsg && Expert?.name) {
          const ttsUrl = await CovertTextToSpeech(aiMsg, Expert.name);
          console.log('[TTS] Playing audio from:', ttsUrl);
          if (ttsUrl && audioPlayer.current) {
            audioPlayer.current.src = ttsUrl;
            audioPlayer.current.play();
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    } finally {
      setLo