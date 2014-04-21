//
//  SearchViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "SearchViewController.h"

@interface SearchViewController ()
@property (weak, nonatomic) IBOutlet UITextField *subjectText;
@property (weak, nonatomic) IBOutlet UITextField *courseNumberText;
@property (weak, nonatomic) IBOutlet UITextField *courseNameText;
@property (weak, nonatomic) IBOutlet UIButton *noPrefButton;
@property (weak, nonatomic) IBOutlet UIButton *yesButton;
@property (nonatomic)BOOL yesSelected;
@property (weak, nonatomic) IBOutlet UIPickerView *subjectPicker;


@end

@implementation SearchViewController
- (IBAction)beginEditSubject:(UITextField *)sender {
    self.subjectPicker.hidden = NO;
    self.subjectPicker.alpha = 1;
}
- (IBAction)searchButton:(UIButton *)sender {
    
    //subject cname cnumber available
    //handles post request for login info
    
    NSMutableDictionary * postParams = [[NSMutableDictionary alloc]init];
    
    if(![[self.subjectText text]isEqualToString:@""])
        [postParams setObject:[self.subjectText text] forKey:@"subject"];
    NSLog(@"SubJuh: %@",[postParams objectForKey:@"subject"]);
    if(![[self.courseNumberText text]isEqualToString:@""])
        [postParams setObject:[self.courseNumberText text] forKey:@"cnumber"];
    NSLog(@"cnumb: %@",[postParams objectForKey:@"cnumber"]);

    if(![[self.courseNameText text]isEqualToString:@""])
        [postParams setObject:[self.courseNameText text] forKey:@"cname"];

    NSLog(@"cnammmm: %@",[postParams objectForKey:@"cname"]);
    
    if(self.yesButton.alpha == 1)
    {
        [postParams setObject:@"2" forKey:@"available"];
        NSLog(@"%@",[postParams objectForKey:@"available"]);
    }
    self.search = [[Search alloc]initWithDictionary:postParams];
    
    NSLog(@"poststring:%@",[self.search postString]);

    
    //get user info from login credentials
    NSString *url = @"http://local.mustangtutors.com/Laravel/public/tutor/search";
    
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
    request.HTTPMethod = @"GET";
    //just subject search
    [request setHTTPBody:[[self.search postString] dataUsingEncoding:NSUTF8StringEncoding]];
    
    [[manager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        if(error) {
            NSLog(@"%@", error);
        }
        //process the tutor info here
        NSLog(@"JSON: %@", responseObject);
        
    }] resume];

    
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (IBAction)availableToggle:(UIButton *)sender {
    self.yesSelected = !self.yesSelected;
    
    if(self.yesSelected)
    {
        [self.yesButton setAlpha:1];
        [self.noPrefButton setAlpha:.3];
    }else
    {
        [self.yesButton setAlpha:.3];
        [self.noPrefButton setAlpha:1];
    }
}

-(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    //One column
    return 1;
}

-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    NSLog(@"Num Rows:%d",[self.subjects count]);

    //set number of rows
    return [self.subjects count];
}

-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component
{
    //set item per row
    NSString * currSubject = [self.subjects objectAtIndex:row];
    NSLog(@"%@",currSubject);
    return [self.subjects objectAtIndex:row];
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.yesSelected = NO;
    self.subjects = [[NSMutableArray alloc]init];
    [self.subjectPicker setHidden:YES];
    [self.subjectPicker setAlpha:0];
    
    self.subjectPicker.showsSelectionIndicator = YES;
    self.subjectText.inputView = self.subjectPicker;

    
    //get the subjects Info
    
    NSString *url = @"http://local.mustangtutors.com/Laravel/public/courses/subjects";
    
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
       // NSLog(@"JSON: %@", responseObject);
        for(int i = 0;i<[responseObject count];i++)
        {
            NSString * temp = [[responseObject objectAtIndex:i]objectForKey:@"subject"];
            [self.subjects addObject:temp];
        }
        NSLog(@"%@",[self.subjects objectAtIndex:0]);
        NSLog(@"%@",[self.subjects objectAtIndex:1]);
        NSLog(@"%d",[self.subjects count]);
        NSLog(@"bubba%@",[self.subjects objectAtIndex:0]);
        [self.subjectPicker reloadAllComponents];
        [self.subjectPicker reloadComponent:0];
        
    }] resume];
    
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(dismissKeyboard)];

    [self.view addGestureRecognizer:tap];
    
}
-(void)dismissKeyboard {
    [self.subjectText setText:[self.subjects objectAtIndex:[self.subjectPicker selectedRowInComponent:0]]];
    [self.subjectText resignFirstResponder];
    [self.courseNameText resignFirstResponder];
    [self.courseNumberText resignFirstResponder];
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
