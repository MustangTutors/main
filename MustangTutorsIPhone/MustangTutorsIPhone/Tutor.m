//
//  Tutor.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/13/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "Tutor.h"

//private data/functions
@interface Tutor ()

@end
@implementation Tutor

-(instancetype)initWithDictionary:(NSDictionary *) dict
{
    self = [super init];
    if(self)
    {
        
        if(_tutorInfo == nil) {
            _tutorInfo = [NSMutableDictionary dictionary];
        }
        [_tutorInfo setObject:[dict objectForKey:@"fName"] forKey:@"First_Name"];
        [_tutorInfo setObject:[dict objectForKey:@"lName"] forKey:@"Last_Name"];
        [_tutorInfo setObject:[dict objectForKey:@"smu_id"] forKey:@"smuId"];
        [_tutorInfo setObject:[dict objectForKey:@"user_id"] forKey:@"userId"];
        [_tutorInfo setObject:@"0" forKey:@"averageRating"];
        [_tutorInfo setObject:@"0" forKey:@"numberOfRatings"];
        [_tutorInfo setObject:[dict objectForKey:@"available"] forKey:@"available"];
        self.smuId = [[_tutorInfo objectForKey:@"smuId"] integerValue];
        self.userId =[[_tutorInfo objectForKey:@"userId"] integerValue];
        self.averageRating = [[_tutorInfo objectForKey:@"averageRating"]doubleValue];
        [self setFullName];
        [self setAvailable];
    }
    return self;
}
-(void)toggleAvailability
{
    if([self isAvailable])
        _available = NO;
    else {
        _available = YES;
    }
}
-(void)setFullName
{
    self.fullName = [NSString stringWithFormat:@"%@ %@",[_tutorInfo objectForKey:@"First_Name"],[_tutorInfo objectForKey:@"Last_Name"]];
}

-(NSMutableDictionary *)tutorInfo
{
    if(!_tutorInfo)_tutorInfo = [[NSMutableDictionary alloc]init];
    return _tutorInfo;
}
-(void)setAverageRating:(double)averageRating
{
    if(!_averageRating)_averageRating = 0.0;
    _averageRating = averageRating;
}
-(void)setAvailable
{
    NSLog(@"The original available value is %d",[[_tutorInfo objectForKey:@"available"]integerValue]);
    if([[_tutorInfo objectForKey:@"available"]integerValue] == 2)
        [self setAvailable:YES];
    else if([[_tutorInfo objectForKey:@"available"]integerValue] == 1){
        [self setAvailable: NO];
    }
}
-(void)setNumberOfRatings:(NSInteger)numberOfRatings
{
    if(!_numberOfRatings)_numberOfRatings = 0;
    _numberOfRatings = numberOfRatings;
}
-(void)setAvailable:(BOOL)available
{
    _available = available;
    
}

@end
