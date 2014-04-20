//
//  TutorProfileViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/13/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorProfileViewController.h"
#import "LoginViewController.h"
#import "UIImageView+AFNetworking.h"
#include <tgmath.h>
#import "TabBarViewController.h"
@interface TutorProfileViewController ()
@property (weak, nonatomic) IBOutlet UISwitch *availableSwitch;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UIImageView *tutorImageView;
@property (weak, nonatomic) NSDictionary * tutorInfo;
@property (weak, nonatomic) IBOutlet UIImageView *star1;
@property (weak, nonatomic) IBOutlet UIImageView *star2;
@property (weak, nonatomic) IBOutlet UIImageView *star3;
@property (weak, nonatomic) IBOutlet UIImageView *star5;
@property (weak, nonatomic) IBOutlet UIImageView *star4;
@property (weak, nonatomic) IBOutlet UILabel *numberOfRatingsLabel;
@end

@implementation TutorProfileViewController

@synthesize tutor;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (IBAction)logOut:(UIButton *)sender {
    
    
    LoginViewController * vc = [self.storyboard instantiateViewControllerWithIdentifier:@"loginViewController"];
    UIStoryboardSegue * logoutSegue = [UIStoryboardSegue segueWithIdentifier:@"logoutSegue" source:self destination:vc performHandler:^{
        NSLog(@"ballsack");
    
    }];
                                        //alloc]initWithIdentifier:@"logoutSegue" source:self destination:vc];
    //[self performSegueWithIdentifier:@"logoutSegue" sender:self];
    //[self prepareForSegue:logoutSegue sender:self];
    [logoutSegue perform];

    
}
-(void)setExtraInitialStates
{
    //get the Tutor Info
    
    NSString *url = [NSString stringWithFormat:@"http://local.mustangtutors.com/Laravel/public/tutor/%d",[self.tutor getUserId]];
    
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
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    [[manager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        if(error) {
            NSLog(@"%@", error);
        }
        //process the tutor info here
        NSLog(@"JSON: %@", responseObject);
        [self.tutor setAverageRating:[[responseObject objectForKey:@"average_rating"]doubleValue]];
        [self.tutor setNumberOfRatings:[[responseObject objectForKey:@"numberOfRatings"]integerValue]];
        NSLog(@"Average Rating%f Number of Ratings %d",[self.tutor getAverageRating],[self.tutor getNumberOfRatings]);
        NSLog(@"average rating whole part %f",floor([self.tutor getAverageRating]));
        [self.nameLabel setText:[self.tutor getFullName]];
        [self.numberOfRatingsLabel setText:[NSString stringWithFormat:@"Average Rating of %d ratings",[self.tutor getNumberOfRatings]]];
        [self setStarValues:[self.tutor getAverageRating]];
        NSLog(@"%@",[responseObject objectForKey:@"comments"]);
        [self.tutor setComments:[responseObject objectForKey:@"comments"]];
        [self.tutor setHours:[responseObject objectForKey:@"hours"]];
        [self.tutor setCourses:[responseObject objectForKey:@"courses"]];
        
    }] resume];
    if([self.tutor isAvailable] == YES)
    {
        [self.availableSwitch setOn:YES animated:NO];
        

    }else{
        [self.availableSwitch setOn:NO animated:NO];

    }
    
}
- (IBAction)toggleAvailable:(UISwitch *)sender {
    [self.tutor toggleAvailability];
    NSLog (@"in here");
    NSString *url = [NSString stringWithFormat:@"http://local.mustangtutors.com/Laravel/public/users/toggle/%d",[self.tutor getUserId]];
    
    NSLog(@"userid =%d  available%hhd",[self.tutor getUserId],[self.tutor isAvailable]);
    // Initialize Session Configuration
    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    
    // Initialize Session Manager
    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:sessionConfiguration];
    
    // Configure Manager
    [manager setResponseSerializer:[AFJSONResponseSerializer serializer]];
    
    // Send Request
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    [[manager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        // Process Response Object
    }] resume];

}

- (void)viewDidLoad
{
    
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;
    
    [self setExtraInitialStates];
    
    NSString * tutorProfileImagePath = [NSString stringWithFormat:@"http://local.mustangtutors.com/img/tutors/%d.jpg",[self.tutor getUserId]];
    [self setImageView:self.tutorImageView withString:tutorProfileImagePath];
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
-(void)setStarValues:(double)numStars
{
    NSString * starImagePath = @"http://local.mustangtutors.com/img/star.png";
    NSString * halfStarImagePath =@"http://local.mustangtutors.com/img/halfstar.png";
    NSString * emptyStarImagePath =@"http://local.mustangtutors.com/img/emptystar.png";
    
    //set fifth star
    //if 5
    if(numStars == 5){
        [self setImageView:self.star5 withString:starImagePath];
        //if 4 and change
    }else if(floor(numStars) == 4.0 && numStars!= 4.0){
        [self setImageView:self.star5 withString:halfStarImagePath];
        //if 4 or less
    }else{
        [self setImageView:self.star5 withString:emptyStarImagePath];
    }
    //set fourth star
    //if greater than or equal to 4
    if(numStars >= 4){
        [self setImageView:self.star4 withString:starImagePath];
        //if 3 and change
    }else if(floor(numStars) == 3.0 && numStars!= 3.0){
        [self setImageView:self.star4 withString:halfStarImagePath];
        //if 3 or less
    }else{
        [self setImageView:self.star4 withString:emptyStarImagePath];
    }
    //set third star
    //if greater than or equal to 3
    if(numStars >= 3){
        [self setImageView:self.star3 withString:starImagePath];
        //if 2 and change
    }else if(floor(numStars) == 2.0 && numStars!= 2.0){
        [self setImageView:self.star3 withString:halfStarImagePath];
        //if 2 or less
    }else{
        [self setImageView:self.star3 withString:emptyStarImagePath];
    }
    //set second star
    //if greater than or equal to 2
    if(numStars >= 2){
        [self setImageView:self.star2 withString:starImagePath];
        //if 1 and change
    }else if(floor(numStars) == 1.0 && numStars!= 1.0){
        [self setImageView:self.star2 withString:halfStarImagePath];
        //if 1 or less
    }else{
        [self setImageView:self.star2 withString:emptyStarImagePath];
    }
    //set first star
    //if greater than or equal to 1
    if(numStars >= 1){
        [self setImageView:self.star1 withString:starImagePath];
        //if 0 and change
    }else if(floor(numStars) == 0.0 && numStars!= 0.0){
        [self setImageView:self.star1 withString:halfStarImagePath];
        //if 0
    }else{
        [self setImageView:self.star1 withString:emptyStarImagePath];
    }

}

@end
