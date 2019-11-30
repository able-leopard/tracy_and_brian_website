# tracy_and_brian_website

https://tracyandbrianart.com/

E-commerce art website built with React + Django + Django REST Framework. 

- Payments handled via Stripe integration 
- Files served on AWS S3 Bucket
- Deployment on Heroku



![GitHub Logo](Exhibits/react_components_mapping.png)


![GitHub Logo](Exhibits/backend_model_relationships.png)


Here is my django session lifecycle mapped out to see when reach of session variables was created and deleted. The sessions helped keep track of the user's cart, shipping & billing information. Majority of the session variables gets deleted after payment is complete.

![GitHub Logo](Exhibits/session_lifecycle.png)
