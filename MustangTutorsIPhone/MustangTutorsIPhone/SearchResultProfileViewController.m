//
//  SearchResultProfileViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/22/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "SearchResultProfileViewController.h"
#import "UIImageView+AFNetworking.h"
#include <tgmath.h>

@interface SearchResultProfileViewController ()
@property (weak, nonatomic) IBOutlet UILabel *availableLabel;
@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UIImageView *tutorImageView;
@property (weak, nonatomic) IBOutlet UIImageView *star1;
@property (weak, nonatomic) IBOutlet UIImageView *star2;
@property (weak, nonatomic) IBOutlet UIImageView *star3;
@property (weak, nonatomic) IBOutlet UIImageView *star5;
@property (weak, nonatomic) IBOutlet UIImageView *star4;
@property (weak, nonatomic) IBOutlet UILabel *numberOfRatingsLabel;

@end

@implementation SearchResultProfileViewController

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
    [self.nameLabel setText:[self.tutor getFullName]];
    [self.numberOfRatingsLabel setText:[NSString stringWithFormat:@"Average Rating of %d ratings",[self.tutor getNumberOfRatings]]];
    [self setStarValues:[self.tutor getAverageRating]];
    NSString * tutorProfileImagePath = [NSString stringWithFormat:@"http://local.mustangtutors.com/img/tutors/%d.jpg",[self.tutor getUserId]];
    [self setImageView:self.tutorImageView withString:tutorProfileImagePath];
    if(![self.tutor isAvailable])
    {
        [self.availableLabel setText:@"Unavailable"];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
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


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
