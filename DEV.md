All development was done with Claude.

I was curious how it will go to implement everything with Claude, but it was a bigger mess than I thought :) 



- testcontainers need a lot of rework, after that I spot there are no publicly available docker images for testing
- docker images are not available - i did not spot that before
- GHA workflow was a mess
- docker compose - old way
- Claude essentially make some flow draft that I have to rewrite, not very effective approach :/ 
- Code needs a lot of cleanup to be maintainable