//
//  SearchResultsViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "SearchResultsViewController.h"
#import "SearchResultTableViewCell.h"
#import "SearchResultProfileViewController.h"
#import "UIImageView+AFNetworking.h"
#import "Tutor.h"
@interface SearchResultsViewController ()

@end

@implementation SearchResultsViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;    //count of section
}
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    /*
    if (indexPath.row == 0){
        cell.backgroundColor = [UIColor blueColor];
    } else if((indexPath.row) % 2 == 1){
        cell.backgroundColor = [UIColor whiteColor];
    }else if(indexPath.row % 4 == 0){
        cell.backgroundColor = [UIColor blueColor];
    }else{
        cell.backgroundColor = [UIColor redColor];
    }*/
    SearchResultTableViewCell * temp = [[SearchResultTableViewCell alloc]init];
    temp = (SearchResultTableViewCell *)cell;
    if(indexPath.row %2 == 1){
        temp.backgroundColor = [UIColor groupTableViewBackgroundColor];
        [temp.availableLabel setTextColor:[UIColor colorWithRed:0 green:.62 blue:.984 alpha:1]];
        [temp.averageRatingLabel setTextColor:[UIColor colorWithRed:0 green:.62 blue:.984 alpha:1]];
        [temp.tutorNameLabel setTextColor:[UIColor colorWithRed:0 green:.62 blue:.984 alpha:1]];
        

    }else{
        temp.backgroundColor = [UIColor colorWithRed:0 green:.62 blue:.984 alpha:1];
        [temp.availableLabel setTextColor:[UIColor groupTableViewBackgroundColor]];
        [temp.averageRatingLabel setTextColor:[UIColor groupTableViewBackgroundColor]];
        [temp.tutorNameLabel setTextColor:[UIColor groupTableViewBackgroundColor]];
    }
    cell.selectedBackgroundView.backgroundColor = [UIColor blackColor];
    
    cell = temp;
    
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    
    NSLog(@"%d",[self.searchResults getNumTutors]);
    return [self.searchResults getNumTutors];    //number of cells will be number of objects in classes
}
- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section {
    // This will create a "invisible" footer
    return 0.01f;
}



- (UITableViewCell *)tableView:(UITableView *)tableView
         cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *MyIdentifier = @"tutorResultCell";
    
    SearchResultTableViewCell *cell = (SearchResultTableViewCell *)[tableView dequeueReusableCellWithIdentifier:MyIdentifier];
    
    if (cell == nil)
    {
        //cell = [[[ScheduleTimeTableViewCell alloc] init] reuseIdentifier:MyIdentifier];
    }
    
    Tutor * temp = [[Tutor alloc]init];
    temp = [self.searchResults.tutors objectAtIndex:indexPath.row];
    
    //set tutor name label
    [cell.tutorNameLabel setText:[NSString stringWithFormat:@"%@",[temp getFullName]]];
    
    //set available label
    if([temp isAvailable] == YES)
    {
        [cell.availableLabel setText:@"Available!"];
    }else
    {
        [cell.availableLabel setText:@"Unavailable"];
    }
    
    //set image view
    NSString * tutorProfileImagePath = [NSString stringWithFormat:@"http://mustangtutors.floccul.us/img/tutors/%d.jpg",[temp getUserId]];
    
    [cell.tutorImageView setImageWithURL:[NSURL URLWithString:tutorProfileImagePath] placeholderImage:[UIImage imageNamed:@"tutor"]];


    //setaverage ratings view
    [cell.averageRatingLabel setText:[NSString stringWithFormat:@"Average Rating of %d ratings: %.3f",[temp getNumberOfRatings],[temp getAverageRating]]];


    return cell;
}
-(void)setImageView:(UIImageView*)imageView withString:(NSString *)imagePath
{
    
    [imageView setImageWithURLRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:imagePath]]
                     placeholderImage:nil
                              success:^(NSURLRequest *request , NSHTTPURLResponse *response , UIImage *image )
     {
         [imageView setImage:image];
         
         NSLog(@"Loaded successfully: %d image Path:%@", [response statusCode],imagePath);
     }failure:nil];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
}

-(void)setExtraInitialStatesTableView:(Tutor *)tutor
{
    //get the Tutor Info
    
    NSString *url = [NSString stringWithFormat:@"http://mustangtutors.floccul.us/Laravel/public/tutor/%d",[tutor getUserId]];
    
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
        //NSLog(@"JSON: %@", responseObject);
        NSLog(@"----------------------------------");
        NSLog(@"Average Rating%f Number of Ratings %d",[tutor getAverageRating],[tutor getNumberOfRatings]);
        NSLog(@"average rating whole part %f",floor([tutor getAverageRating]));
        //[self.nameLabel setText:[tutor getFullName]];
        NSLog(@"%@",[responseObject objectForKey:@"comments"]);
        [tutor setComments:[responseObject objectForKey:@"comments"]];
        [tutor setHours:[responseObject objectForKey:@"hours"]];
        [tutor setCourses:[responseObject objectForKey:@"courses"]];
        [self.searchResultsTableView reloadData];
    }] resume];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Make sure your segue name in storyboard is the same as this line
    if ([[segue identifier] isEqualToString:@"segueToProfileFromResults"])
    {
        // Get reference to the destination view controller
        SearchResultProfileViewController * pv = (SearchResultProfileViewController *)[segue destinationViewController];
        Tutor * temp = [[Tutor alloc]init];
        temp = [self.searchResults.tutors objectAtIndex:[[self.searchResultsTableView indexPathForSelectedRow]row]];
        [pv setTutor:temp];
    }
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

@end
