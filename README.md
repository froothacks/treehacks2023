# Grad✓ient

## Inspiration

One of our teammates, Albert, used to work part-time at Kumon, which is a tutoring service that focuses on tutoring in math and English. Specifically, he used to spend countless hours working on the mundane task of grading elementary school math worksheets. This type of work isn't particularly enjoyable and can be prone to human error as well, due to the tedious repetition, similar to assembly lines within factories. For Kumon alone, over 4 million students study across 58 countries with over 25,000 centers, which is a crazy-large scale (source: VettedBiz). The same problem applies to elementary schools across the world that use similar worksheets, applying to tens of millions more students and markers. 

While assembly lines have been largely revamped, it's still the standard for worksheets to be manually graded. In a world that's being drastically changing due to the far-reaching consequences of AI, we wanted to apply the power of AI and machine vision to automatically grade these worksheets. Our primary motivation was to reduce the mundane work for markers in addition to reducing the turnaround time for students to get their work back. 

<img src="https://i.imgur.com/grqyzgo.png"  width="300">

## What it does

- Grad✓ient (our name is inspired by "gradient descent" from ML :P) is a web application that easily allows teachers to automatically bulk mark student worksheets.
- Teachers use our online system to annotate their worksheets (using our predicted answer bounding boxes). Then, they can upload all student submissions for quick, automated grading that includes individual grades for each worksheet.
- Under the hood, Grad✓ient uses OpenCV, Microsoft's transformer models (with PyTorch) for OCR and Convex / Flask for our backend, and React for our frontend. Check out the section below for more details on the flow and how we built it!

## How we built it
- First, we diff the answer key and blank worksheet to get the image diff of just the answers. From this diff, using OpenCV, we can attempt to predict the bounding boxes for the answer fields within the worksheet.
- These predicted answer bounding boxes are then shown to the teacher in a GUI where they can edit (add, remove, modify) all bounding boxes to ensure accuracy. 
- From here, we allow the teacher to upload the student submissions.
- Once they're completed uploading all student submissions for worksheets, they can submit them for auto-grading by Grad✓ient.
- We then use Microsoft transformer models using PyTorch to run OCR on the image to pick out the text within the answer bounding boxes. We compare this against the answer key to find out which answers are correct and wrong.
- Feedback is then persisted and shown to the teacher, along with scores for each student submission.
- Note that we're heavily using Convex for our backend TypeScript service - we use it for managing our database and interacting with our Python service (which handles the AI side). 

## Challenges we ran into
- Image alignment can be quite tough - we imagine that teachers would love to use industrial scanners that are available within schools, rather than take a lot of photos with their phones. These scanners are generally quite reliable and high-quality, however, they aren't pixel-perfect. As such, diffing two images results in significant noise if misaligned. As such, Leon made extensive use of OpenCV and their ML models to alleviate the alignment concerns
- Creating an interface for labeling turned out to be much harder than it looked - the ability for users to be able to resize bounding boxes and add/delete them easily, along with having them overlaid on top of images was quite an interesting challenge.
- Finding a printer + scanner and getting access to it on campus is unfortunately quite tough 😛. Shout-out to the TreeHacks organizers for letting us use one in the hardware hub, after our unfruitful ventures down the depths of Stanford halls!
- Models can take an extremely long time for inference - when originally using Microsoft transformer models for the handwriting OCR, we were seeing it take several minutes for a single page which was quite unreasonable for our use case. By trimming down the amount of content in the image, the resolution, and the size of the model itself, we were able to cut this down to more reasonable times.
- It was our first time using Convex which was quite a new way of thinking about our backend side - completely integrating it into our frontend services with an emphasis on serverless functions was quite an interesting concept. Although we ran into several challenges with some of the more cutting-edge parts of Convex and resources online (the documentation was great but definitely not as many StackOverflow posts, which makes sense 😅). We really enjoyed using it and will be considering using it for future projects as well! Big shout-out to the Convex team on-site and on Slack for being super responsive as well! Definitely enjoyed avoiding migration pain with our SQL adventures on previous projects, haha!


## Accomplishments that we're proud of
- Making it work! This was something we were honestly unsure about when we started working on this project - over the span of 36 hours, we were able to get something from zero to an MVP which achieves our main object of automatic worksheet grading.
- It was one of our first times exploring machine vision and diving deeper into ML models for this space!
- Creating an intuitive annotation interface for teachers (answer bounding boxes), after much React pain  😛.
- Building something we (or our past selves) would use :D!
- Hooking up Convex, which involved quite a new mental model of software design for us.

## What we learned
- OCR is hard 🙃
- Some worksheets have incorrect answer keys - don't trust the internet 😂
- A lot more respect for our teachers and teaching assistants, as we went through worksheet examples. Though, teachers are already some of the people we have to thank the most for being amazing mentors in our life <3. 
- Sleep is probably a good idea - though we didn't do a good job of living out this principle, achieving a grand total of 3 hours of sleep each over the course of the hackathon 💤.
- Scanners aren't perfect 😢

## What's next for Grad✓ient
Given unlimited time and resources, we'd love to add the following:
- We'd love to add a student-side interface where we can directly show students their grades instead of having the intermediary as a teacher.
- We wanted to add the ability for teachers to be able to share worksheets with each other - as we onboard more teachers onto our platform, we would hope to foster a collaborative community where they can share annotated worksheets with each other and minimize the friction for Grad✓ient.
- For more complicated questions, such as essay-based questions, we'd love to use advanced AI models to provide more thorough "subjective" feedback, not just objective feedback based on an answer key - one could imagine students also using such a tool for practicing such questions without needing another human to provide personalized feedback.
- Near the end of the hackathon, we started work on adding authentication with Auth0 and Convex - however, we ran into some issues with handling login state and persistence (largely just minor errors we needed to work through but we ran out of time). Ideally, we'd have individual accounts for students, teachers, and any other users of the tool.
