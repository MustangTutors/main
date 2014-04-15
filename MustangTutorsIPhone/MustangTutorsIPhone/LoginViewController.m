//
//  LoginViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/3/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "LoginViewController.h"
#import "TutorProfileViewController.h"
#import "TabBarViewController.h"
#import "Tutor.h"
#import "UIImageView+AFNetworking.h"

@interface LoginViewController ()
@property (weak, nonatomic) IBOutlet UIImageView *titleImageView;
@property (strong) NSMutableArray *devices;
@property (weak, nonatomic) IBOutlet UIImageView *logoImageView;
@property (nonatomic,strong)Tutor * tutor;
@end

@implementation LoginViewController

- (NSManagedObjectContext *)managedObjectContext {
    NSManagedObjectContext *context = nil;
    id delegate = [[UIApplication sharedApplication] delegate];
    if ([delegate performSelector:@selector(managedObjectContext)]) {
        context = [delegate managedObjectContext];
    }
    return context;
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Make sure your segue name in storyboard is the same as this line
    if ([[segue identifier] isEqualToString:@"segueToTutorProfile"])
    {
        // Get reference to the destination view controller
        TabBarViewController * tb = (TabBarViewController *)[segue destinationViewController];

        // TutorProfileViewController * vc = (TutorProfileViewController*)[segue destinationViewController];
        // Pass any objects to the view controller here, like...
        //vc.tutor = self.tutor;
        [tb setTutor:self.tutor];
        //tb.tutor = self.tutor;
    }
}

- (IBAction)login:(id)sender {
    NSManagedObjectContext *context = [self managedObjectContext];
    
    // Create a new managed object
    NSManagedObject *newDevice = [NSEntityDescription insertNewObjectForEntityForName:@"Device" inManagedObjectContext:context];
    [newDevice setValue:self.smuIdTextField.text forKey:@"smuId"];
    [newDevice setValue:self.passwordTextField.text forKey:@"password"];
    
    NSError *error = nil;
    // Save the object to persistent store
    if (![context save:&error]) {
        NSLog(@"Can't Save! %@ %@", error, [error localizedDescription]);
    }
    [self loadText];
    [self dismissViewControllerAnimated:YES completion:nil];
    [self clickedBackground];
    
    
    
    //handles post request for login info
    
    
    //get user info from login credentials
    NSString *url = @"http://local.mustangtutors.com/Laravel/public/users/login";
    
    // Initialize Session Configuration
    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    
    // Initialize Session Manager
    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:sessionConfiguration];
    
    // Configure Manager
    AFJSONResponseSerializer * serializer = [AFJSONResponseSerializer serializer];
    NSMutableSet * set = [NSMutableSet setWithSet:serializer.acceptableContentTypes];
    [set addObject:@"text/html"];
    [serializer setAcceptableContentTypes:set];
    [manager setResponseSerializer:serializer];
    
    // Send Request
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    request.HTTPMethod = @"POST";
    NSString *postString = [NSString stringWithFormat:@"smu_id=%@&password=%@", self.smuIdTextField.text,self.passwordTextField.text];
    [request setHTTPBody:[postString dataUsingEncoding:NSUTF8StringEncoding]];
    
    [[manager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        if(error) {
            NSLog(@"%@", error);
        }
        //process the tutor info here
        NSLog(@"JSON: %@", responseObject);
        NSLog(@"%@", [responseObject class]);
        if([[responseObject objectAtIndex:0] objectForKey:@"smu_id"] != NULL)
        {
            self.tutor = [[Tutor alloc]initWithDictionary:[responseObject objectAtIndex:0]];
            [self.tutor setAvailable:YES];
            [self performSegueWithIdentifier:@"segueToTutorProfile" sender:self];
        }else
        {
            NSLog(@"balls");
        }
        
    }] resume];

    

}
/*
-(Tutor *)tutor
{
   // NSDictionary * dict = [[NSDictionary alloc] init];
    if(!_tutor)_tutor = [[Tutor alloc] init];
    return _tutor;
}*/
- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}
- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    // Fetch the devices from persistent data store
    NSManagedObjectContext *managedObjectContext = [self managedObjectContext];
    NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] initWithEntityName:@"Device"];
    self.devices = [[managedObjectContext executeFetchRequest:fetchRequest error:nil] mutableCopy];
    
    //[self.tableView reloadData];
    [self setImageView:self.logoImageView withString:@"http://local.mustangtutors.com/img/logo.png"];
    [self setImageView:self.titleImageView withString:@"http://local.mustangtutors.com/img/mustangtutors-blue.png"];
}

-(void)loadText
{
    
    NSManagedObject *device = [self.devices objectAtIndex:0];
    [self.welcomeValueLabel setText:[NSString stringWithFormat:@"%@", [device valueForKey:@"smuId"]]];
    [self.welcomeLabel setText:@"Welcome"];
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    //self.welcomeValueLabel.delegate = self;
}
- (IBAction) clickedBackground
{
    [self.view endEditing:YES]; //make the view end editing!
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
-(void)setImageView:(UIImageView*)imageView withString:(NSString *)imagePath
{
    
    [imageView setImageWithURLRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:imagePath]]
                    placeholderImage:nil
                    success:^(NSURLRequest *request , NSHTTPURLResponse *response , UIImage *image )
                    {
                        [imageView setImage:image];
                        NSLog(@"Loaded successfully: %d", [response statusCode]);
                    }failure:nil];
}




#define kOFFSET_FOR_KEYBOARD 200.0

-(void)keyboardWillShow {
    // Animate the current view out of the way
    if (self.view.frame.origin.y >= 0)
    {
        [self setViewMovedUp:YES];
    }
    else if (self.view.frame.origin.y < 0)
    {
        [self setViewMovedUp:NO];
    }
}

-(void)keyboardWillHide {
    if (self.view.frame.origin.y >= 0)
    {
        [self setViewMovedUp:YES];
    }
    else if (self.view.frame.origin.y < 0)
    {
        [self setViewMovedUp:NO];
    }
}

-(void)textFieldDidBeginEditing:(UITextField *)sender
{
    if ([sender isEqual:self.smuIdTextField])
    {
        //move the main view, so that the keyboard does not hide it.
        if  (self.view.frame.origin.y >= 0)
        {
            [self setViewMovedUp:YES];
        }
    }
}

//method to move the view up/down whenever the keyboard is shown/dismissed
-(void)setViewMovedUp:(BOOL)movedUp
{
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.3]; // if you want to slide up the view
    
    CGRect rect = self.view.frame;
    if (movedUp)
    {
        // 1. move the view's origin up so that the text field that will be hidden come above the keyboard
        // 2. increase the size of the view so that the area behind the keyboard is covered up.
        rect.origin.y -= kOFFSET_FOR_KEYBOARD;
        rect.size.height += kOFFSET_FOR_KEYBOARD;
    }
    else
    {
        // revert back to the normal state.
        rect.origin.y += kOFFSET_FOR_KEYBOARD;
        rect.size.height -= kOFFSET_FOR_KEYBOARD;
    }
    self.view.frame = rect;
    
    [UIView commitAnimations];
}

- (void)viewWillAppear:(BOOL)animated
{
    // register for keyboard notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    // unregister for keyboard notifications while not visible.
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillShowNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
}


@end
